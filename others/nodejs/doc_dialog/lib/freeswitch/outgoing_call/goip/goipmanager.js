module.exports = GoIPManager;
var GoIPGateway = require('./goipgateway');
var OperatorHelper = require('./operatorhelper');

function GoIPManager( goipSettings, operators, caller, goipMonitor){
    var self = this;
    self._gateways = [];
    self._operatorHelper = new OperatorHelper( operators);
    self._goipMonitor = goipMonitor;

    self._createGateways = function( gateways, callQueueMaxLength)
    {
        for( var i in gateways)
            self._gateways.push( new GoIPGateway( gateways[ i].operator, gateways[ i].callEndpoint, gateways[ i].prefix, caller, callQueueMaxLength));
    }

    self._createGateways( goipSettings.gateways, goipSettings.callQueueMaxLength);

    self.getGatewayForCall = function( phoneNumber)
    {
        if( !self._goipMonitor.isDeviceAvailable())
            return null;

        var operator = self._operatorHelper.getOperator( phoneNumber);
        if( !operator)
            return null;

        var operatorGateways = self._getOperatorGateways( operator);

        if( !operatorGateways.length)
            return null;

        var freeGateway = self._getFreeGateway( operatorGateways);

        if( freeGateway){
            return freeGateway;
        }

        var nonOverloadedGateways = self._getNonOverloadedGateways( operatorGateways);
        if( !nonOverloadedGateways.length)
            return null;

        var minLoadedGateway = self._getMinLoadedGateway( nonOverloadedGateways);
        return minLoadedGateway;
    };

    self._printGW = function( gateways)
    {
        for( var i in gateways)
        {
            console.log( gateways[i]._prefix);
        }
    };

    self.call = function( gateway, phoneNumber, callbacksObj)
    {
        gateway.call( phoneNumber, callbacksObj);
    };

    self._getOperatorGateways = function( operator)
    {
        var gateways = [];
        for( var i in self._gateways)
        {
            if( self._gateways[ i].getOperator() == operator)
                gateways.push( self._gateways[ i]);
        }

        return gateways;
    };

    self._getFreeGateway = function( gateways)
    {
        for( var i in gateways)
        {
            if( gateways[ i].isFree() && gateways[ i].getLoad() == 0)
               return gateways[ i];
        }

        return null;
    };

    self._getNonOverloadedGateways = function( gateways)
    {
        var resultGateways = [];

        for( var i in gateways)
        {
            if( !gateways[ i].isOverloaded())
                resultGateways.push( gateways[ i]);
        }

        return resultGateways;
    };

    self._getMinLoadedGateway = function( gateways)
    {
        var minLoadedGateway = gateways[ 0];

        if( gateways.length == 1)
            return minLoadedGateway;

        for( var i = 1; i < gateways.length; i++)
        {
            if( gateways[ i].getLoad() < minLoadedGateway.getLoad())
                minLoadedGateway = gateways[ i];
        }

        return minLoadedGateway;
    };
}
