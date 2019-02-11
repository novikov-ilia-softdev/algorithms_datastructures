module.exports = ScriptManager;

var phoneBlackList = [];

var DoctorSettings = require( '../settings/doctorsettings');

try {
  phoneBlackList = require('../../db/phoneblacklist');
} catch (error) {
  switch (error.code)
  {
    case 'MODULE_NOT_FOUND': break; //ignore
    default: 
     throw (error);
  }
};

function isBlocked (phoneNumber){
    var phoneNumber8, phoneNumber7;
    var firstChar = phoneNumber.substr(0,1);

    switch (firstChar){
        case '8' :  phoneNumber7 = '+7'+phoneNumber.substr(1);
                    phoneNumber8 = phoneNumber;
                    break;
        case '7' :  phoneNumber7 = '+' + phoneNumber;
                    phoneNumber8 = '8' + phoneNumber.substr(1);
                    break;
        case '+' :  phoneNumber7 = phoneNumber;
                    phoneNumber8 = '8' + phoneNumber.substr(2);
                    break;
        default:    phoneNumber7 = phoneNumber;
                    phoneNumber8 = phoneNumber;
    }

    for (var blocked of phoneBlackList)
    {   
        if (  (blocked == phoneNumber7) 
           || (blocked == phoneNumber8))
           return true;
    }
    return false;
}

function ScriptManager( module){
    var self = this;
    self.module = module;

    self.handleIncomingCall = function( conn, id, scenario_id){
        var scenario =  self.module.scenarioManager.get(scenario_id);
        var srcPhoneNumber = self._getSrcPhoneNumberByConnection( conn);
        var dstPhoneNumber = self._getDstPhoneNumberByConnection( conn);
        var doctorSettings = DoctorSettings.getDefault();

        if (!isBlocked(srcPhoneNumber)){
            self.module.clientManager.createPatient( srcPhoneNumber, function( err){
                self.module.clientManager.getDoctor( dstPhoneNumber, function( doctor){
                    if( !doctor){
                        self.module.scriptLauncher.emit( 'commandFromScript', {action:'finishCall'}, id);
                        return;
                    }

                    self.module.clientManager.isPatientHasRecord( srcPhoneNumber, doctor.phone_number_work, function( record){
                        record ?
                            self.module.scriptLauncher.runPatientWithRecord( srcPhoneNumber, doctor, record, id, scenario, doctorSettings) :
                            self.module.scriptLauncher.runPatientWithoutRecord( srcPhoneNumber, doctor, id, scenario, doctorSettings)

                    }, scenario);
                }, scenario);
            }, scenario);
        }
        else {
            self.module.scriptLauncher.emit( 'commandFromScript', {action:'finishCall'}, id);
        }
    };

    self._getSrcPhoneNumberByConnection = function( conn){
        for( var i in conn.channelData.headers){
            if( conn.channelData.headers[ i].name == 'Channel-Username')
                return conn.channelData.headers[ i].value;
        }

        return null;
    };

    self._getDstPhoneNumberByConnection = function( conn){
        for( var i in conn.channelData.headers){
            if( conn.channelData.headers[ i].name == 'Channel-Destination-Number')
                return conn.channelData.headers[ i].value;
        }

        return null;
    };
}