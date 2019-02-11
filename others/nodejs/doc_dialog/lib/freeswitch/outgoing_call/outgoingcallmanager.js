var Caller = require('./caller');
var GoIPMonitor = require('./goip/goipmonitor');
var GoIPManager = require('./goip/goipmanager');
var MultifonManager = require('./multifon/multifonmanager');

module.exports = OutgoingCallManager;

function OutgoingCallManager( module, settings, connection){
    var self = this;
    self._module = module;
    self._settings = settings;
    var caller = new Caller( connection);
    var goipMonitor = new GoIPMonitor( connection);
    self._goipManager = new GoIPManager( settings.outgoingCall.goip, settings.outgoingCall.operators, caller, goipMonitor);
    self._multifonManager = new MultifonManager( caller);

    self.call = function( phoneNumber, from_phone_number, callbacksObj)
    {
        var callResultCallback = function( id, isAnswered, logInfo){
            if( isAnswered) {
                callbacksObj.callResultCallback( id, isAnswered, logInfo);
            } else {
                self._multifonManager.call( phoneNumber, from_phone_number, callbacksObj);
            }
        };

        var answeredCallEndedCallback = function( id, logInfo){
            callbacksObj.answeredCallEndedCallback( id, logInfo);
        };

        var callbacks = {
            'callResultCallback': callResultCallback,
            'answeredCallEndedCallback': answeredCallEndedCallback };

        var gateway = self._goipManager.getGatewayForCall( phoneNumber);
        gateway ?
            self._goipManager.call( gateway, phoneNumber, callbacks) :
            self._multifonManager.call( phoneNumber, from_phone_number, callbacksObj);
    };
}
