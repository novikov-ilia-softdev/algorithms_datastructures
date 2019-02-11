var EventEmitter = require( "events").EventEmitter;
var util = require( "util");
var timeSettings = require( '../timesettings/timesettings');
var events = require( '../event/events');

module.exports = InitiatorManager;
util.inherits( InitiatorManager, EventEmitter);

function InitiatorManager( module){
	var _self = this;
	_self.module = module;
	_self.isInit = false;
	_self.initiator = null;
	_self.prevInitiator = null;
	
	// +
	_self.init = function(){
		_self.runInitiatorMonitoring();
		setInterval( _self.runInitiatorMonitoring, timeSettings.initiatorMonitoringIntervalMs);
		_self.isInit = true;
	}
	
	// +
	_self.getInitiator = function(){
		return _self.initiator;
	}
	
	// +
	_self.isInitiator = function(){
		return ( _self.module.netManager.getSelfAddresses().indexOf( _self.initiator) != -1);
	}
	
	// -
	_self.runInitiatorMonitoring = function(){
		var DEFAULT_GW_ADDRESS = "0.0.0.0";
		var initiatorCandidates = [];
			
		var routesList = _self.module.netManager.getRoutingTable();
		
		for( var i in routesList){
			if( routesList[ i].gw == DEFAULT_GW_ADDRESS)
				continue;
			
			initiatorCandidates.push( routesList[ i].dest);
		}
		
		var selfAddresses = _self.module.netManager.getSelfAddresses();
		
		for( var i in selfAddresses){
			initiatorCandidates.push( selfAddresses[ i]);
		}
		
		if( initiatorCandidates.length)
			_self.findMinAddress( initiatorCandidates);
	}
	
	// -
	_self.findMinAddress = function( addressList){
		var minAddress = addressList[ 0];
		
		if( addressList.length == 1)
			return minAddress;
		
		for( var i = 1; i <  addressList.length; i++){
			if( addressList[ i] < minAddress)
				minAddress = addressList[ i];
		}
		
		_self.prevInitiator = _self.initiator;
		_self.initiator = minAddress;
		
		if( _self.prevInitiator != _self.initiator){
			var isThisNode = _self.isInitiator() ? "(me)" : "(not me)";
			_self.module.logger.logMessage( "initiator changed to " + _self.initiator + " " + isThisNode);
			_self.isInitiator() ? _self.emit( events.selfStartedInitiator.name) :  _self.emit( events.selfEndedInitiator.name);
		}
	}
}