module.exports = Caller;

function Caller( connection){
    var self = this;
    self._connection = connection;

    self.call = function( callEndpoint, prefix, phoneNumber, operator, callbacksObj)
    {
        var command = 'originate';
        var arguments = prefix ?
            `{ignore_early_media=true,originate_timeout=25}sofia/gateway/${callEndpoint}/${prefix}${phoneNumber} &park()`:
            `{ignore_early_media=true,originate_timeout=25}sofia/gateway/${callEndpoint}/${phoneNumber} &park()`

        self._connection.bgapi( command, arguments, function( result){
            var logInfo = self._createLogInfo( callEndpoint, phoneNumber, prefix, operator);

            var id = result.body;
            var res = /\+OK (.*)/.exec(id);
            if( res) {
                id = res[1];
                callbacksObj.callResultCallback( id, true, logInfo);

            } else {
                callbacksObj.callResultCallback( null, false, logInfo);
                return;
            }

            var hangup_event = `esl::event::CHANNEL_HANGUP_COMPLETE::${id}`;
            self._connection.once( hangup_event, (event)=> {
                callbacksObj.answeredCallEndedCallback( id, logInfo);
            });
        });
    };

    self._createLogInfo = function( callEndpoint, dstPhoneNumber, prefix, operator)
    {
        var logInfo = {};
        logInfo.operator = operator;
        logInfo.callEndpoint = callEndpoint;
        logInfo.dstPhoneNumber = dstPhoneNumber;
        logInfo.prefix = prefix;

        return logInfo;
    };
}