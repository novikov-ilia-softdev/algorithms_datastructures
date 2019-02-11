module.exports = GoIPGateway;
var fifo = require('fifo');
var CallQuery = require( './callquery');

function GoIPGateway( operator, callEndpoint, prefix, caller, callQueueMaxLength){
    var self = this;
    self._operator = operator;
    self._callEndpoint = callEndpoint;
    self._prefix = prefix;
    self._isFree = true;
    self._callQueue = new fifo();
    self._caller = caller;
    self._maxQueueSize = callQueueMaxLength;

    self.call = function( phoneNumber, callbacksObj)
    {
        self._isReadyForCall() ?
            self._callWhenFree( phoneNumber, callbacksObj) :
            self._callWhenBusy( phoneNumber, callbacksObj);
    };

    self.isFree = function()
    {
        return self._isFree;
    };

    self.isOverloaded = function()
    {
        return ( self._callQueue.length >= self._maxQueueSize);
    };

    self.getLoad = function()
    {
        return self._callQueue.length;
    };

    self.getOperator = function()
    {
        return self._operator;
    };

    self._isReadyForCall = function()
    {
        return ( self._isFree && self._callQueue.isEmpty());
    };

    self._callWhenFree = function( phoneNumber, callbacksObj)
    {
        self._isFree = false;

        var callResultCallback = function( id, isAnswered, logInfo){
            if( isAnswered) {
                callbacksObj.callResultCallback( id, isAnswered, logInfo);
            } else {
                self._isFree = true;
                callbacksObj.callResultCallback( id, isAnswered, logInfo);
                self._handleCallEnded();
            }
        };

        var answeredCallEndedCallback = function( id, logInfo){
            self._isFree = true;
            callbacksObj.answeredCallEndedCallback( id, logInfo);
            self._handleCallEnded();
        };

        var callbacks = {
            'callResultCallback': callResultCallback,
            'answeredCallEndedCallback': answeredCallEndedCallback };


        self._caller.call( self._callEndpoint, self._prefix, phoneNumber, self._operator, callbacks);
    };

    self._callWhenBusy = function( phoneNumber, callbacksObj)
    {
        var callQuery = new CallQuery( phoneNumber, callbacksObj);
        self._callQueue.push( callQuery);
        //console.log( 'queueing... ', self._callQueue.length);
    };

    self._handleCallEnded = function()
    {
        if( !self._callQueue.isEmpty()){
            var callQuery = self._callQueue.shift();
            self._callWhenFree( callQuery.getPhoneNumber(), callQuery.getCallbacks());
        }
    };
}