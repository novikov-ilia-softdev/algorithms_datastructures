module.exports = GoIPMonitor;

function GoIPMonitor( connection){
    var self = this;
    self._connection = connection;
    self._isDeviceAvailable = false;

    self.isDeviceAvailable = function()
    {
        return self._isDeviceAvailable;
    };

    self._getDeviceAvailability = function(){
        self._getGatewaySip( function( sip){
            if( !sip){
                self._isDeviceAvailable = false;
                return;
            }

            self._getDeviceStatus( sip, function( isAvailable){
                self._isDeviceAvailable = isAvailable;
            })
        })
    }

    self._getGatewaySip = function( callback){
        var command = 'sofia status gateway goip';
        self._connection.bgapi( command, function( result){
            var sip = self._getFieldFromResult( 'From', result);
            callback( sip);
        });
    }

    self._getDeviceStatus = function( sip, callback){
        var command = 'sofia status profile external reg'
        self._connection.bgapi( command, function( result){
            var contact = self._getFieldFromResult( 'Contact:', result);
            contact ? callback( contact.indexOf( sip) != -1) : callback( false);
        });
    }

    self._getFieldFromResult = function( field, result){
        var arrRes = result.body.split( '\n');
        for( var i in arrRes){
            if( arrRes[ i].indexOf( field) != -1){
                var fromStr = arrRes[ i];
                var fromArrStr = fromStr.split( '\t');
                return fromArrStr[ 1];
            }
        }

        return null;
    }

    self._start = function(){
        self._getDeviceAvailability();
        setInterval( self._getDeviceAvailability, 30000);
    }

    self._start();
}
