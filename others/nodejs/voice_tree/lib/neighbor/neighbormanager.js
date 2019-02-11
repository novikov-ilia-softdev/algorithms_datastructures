var EventEmitter = require( "events").EventEmitter;
var util = require( "util");
var timeSettings = require( '../timesettings/timesettings');
var NeighborInfo = require( './neighborinfo');
var states = require( '../wave/states');
var events = require( '../event/events');

module.exports = NeighborManager;
util.inherits( NeighborManager, EventEmitter);

function NeighborManager( module){
	var _self = this;
	_self.module = module;
	_self.neighbors = [];
	
	_self.init = function(){
		setInterval( _self.startNeighborsMonitoring, timeSettings.neighborsMonitoringInrevalMs)
	}
	
	// +
	_self.startNeighborsMonitoring = function(){
		var currentTime = new Date();
		
		for( var i in _self.neighbors){
			_self.neighbors[ i].inactiveTimeMs = currentTime - _self.neighbors[ i].recvTime;
			if( _self.neighbors[ i].inactiveTimeMs > timeSettings.neighborLostTimeoutMs &&
				!_self.isNeighbor( i)){
				
				delete _self.neighbors[ i];
				
				if( _self.module.parentManager.isPrevParent( i))
					_self.emit( events.lostConnectionWithPrevParent.name);
				
				if( _self.module.parentManager.isParent( i))
					_self.emit( events.lostConnectionWithParent.name);
				
				return;
			}
			
			if( _self.module.parentManager.isParent( i))
				_self.handleParent( _self.neighbors[ i]);
		}
	}
	
	_self.handleParent = function( parent){
		if( !parent)
			return;
		
		if( _self.isParentChangedState( parent)){
			//_self.module.waveManager.setCurrentState( states.greenState);
			_self.emit( events.parentChangedColour.name, _self.module.waveManager.getCurrentWave());
		}
	}
	
	_self.isParentChangedState = function( parent){
		if( !parent)
			return false;
		
		return ( _self.module.waveManager.getCurrentWave().state == states.grayState &&
				 //_self.module.waveManager.getCurrentWave().waveCount == parent.nodeState.wave.waveCount &&
				 parent.nodeState.wave.state == states.greenState)
	}
	
	// +
	_self.handleMessage = function( msg, rinfo){		
		if( !_self.isNeighbor( rinfo.address))
			return;
		
		var neighborNodeState;
		
		try{
			neighborNodeState = JSON.parse( msg.toString());
		}
		catch( ex){
			return;
		}
		
		neighborInfo = new NeighborInfo( neighborNodeState, rinfo.address);
		_self.neighbors[ neighborInfo.address] = neighborInfo;
	}
	
	// -
	_self.getTwoNeighbors = function( forbiddenAddress){
		var neighbors = [];
		var MAX_NEIGHBORS = 2;
		var possibleNeighbors = Object.keys( _self.neighbors);
		possibleNeighbors = possibleNeighbors.sort();
		_self.module.logger.logMessage( "possibleNeighbors: " + JSON.stringify( possibleNeighbors));
		for( var i in possibleNeighbors){
			if( //_self.neighbors[ possibleNeighbors[ i]].nodeState.wave.waveCount < _self.module.waveManager.getCurrentWave().waveCount &&
				_self.neighbors[ possibleNeighbors[ i]].nodeState.wave.state != states.grayState &&
				possibleNeighbors[ i] != forbiddenAddress){
				
				neighbors.push( possibleNeighbors[ i]);
				if( neighbors.length == MAX_NEIGHBORS)
					break;
			}
		}
		
		return neighbors;
	}
	
	// +
	_self.isNeighbor = function( address){
		var routesList = _self.module.netManager.getRoutingTable();
		var endOfAddress = _self.getEndOfIP( address);
		for( var i in routesList){
			var endOfDest = _self.getEndOfIP( routesList[ i].dest);
			var endOfGw = _self.getEndOfIP( routesList[ i].gw);
			if( endOfDest == endOfAddress && endOfGw == endOfAddress)
				return true;
		}
		
		return false;
	}
	
	_self.getEndOfIP = function( address){
		return (address.substring( address.lastIndexOf(".") + 1));
	}
	
	// +
	_self.notifyTwoNeighbors = function( forbiddenAddress){
		var neighbors = _self.getTwoNeighbors( forbiddenAddress);
		var nodeState = _self.module.waveManager.getNodeState();
		nodeState.wave.state = states.grayState;
		_self.module.logger.logMessage( "send " + JSON.stringify( nodeState) + " to neighbors: " + JSON.stringify( neighbors));
		var count = 0;
		for( var i in neighbors){
			if( count){
				setTimeout( function(){
					module.netManager.sendMessage( neighbors[ i], JSON.stringify( nodeState));	
				}, timeSettings.notifyTwoNeighborsDelayTimeoutMs);
			}
			else{
				module.netManager.sendMessage( neighbors[ i], JSON.stringify( nodeState));				
			}
			count++;
		}
	}
	
	_self.getNeighbors = function(){
		return _self.neighbors;
	}
}