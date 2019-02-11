module.exports = MultifonManager;
var MultifonGateway = require('./multifongateway');

function MultifonManager( caller){
    var self = this;
    self._caller = caller;

    self.call = function( phoneNumber, from_phone_number, callbacksObj)
    {
        var callEndpoint = self._getCallEndpoint( from_phone_number);

        // TEST
        // ---------------------------------------------
        //phoneNumber = '1234@192.168.0.148:5100';
        //callEndpoint = 'external::example.com';
        // ---------------------------------------------

        self._caller.call( callEndpoint, null, phoneNumber, callEndpoint, callbacksObj);
    };

    self._getCallEndpoint = function( from_phone_number)
    {
        return 'megafon_doctor_' + from_phone_number;
    };
}
