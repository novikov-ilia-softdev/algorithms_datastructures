var EventEmitter = require( "events").EventEmitter;
var util = require( "util");
var events = require( '../event/events');

module.exports = ParentManager;
util.inherits( ParentManager, EventEmitter);

function ParentManager( module){
	var _self = this;
	_self.module = module;
	_self.parent = null;
	_self.prevParent = null;
	
	// +
	_self.getParent = function(){
		return _self.parent;
	}
	
	// +
	_self.setParent = function( address){
		//_self.module.logger.logMessage( "setParent " + JSON.stringify( arguments) + ",_self.parent ==  " + _self.parent);
		if( address != _self.parent){
			_self.prevParent = _self.parent;
			_self.parent = address;
			_self.emit( events.parentChanged.name, _self.parent);
		}
	}
	
	// +
	_self.isParent = function( address){
		return (_self.parent == address);
	}
	
	// +
	_self.getPrevParent = function(){
		return _self.prevParent;
	}
	
	// +
	_self.setPrevParent = function( address){
		if( _self.prevParent && address != _self.prevParent){
			_self.prevParent = address;
			_self.emit( events.prevParentChanged.name, _self.prevParent);
		}
	}
	
	// +
	_self.isPrevParent = function( address){
		return (_self.prevParent == address);
	}
	
	// +
	_self.findNewParent = function(){
		var parent = null;
		var neighbors = _self.module.neighborManager.getNeighbors();
		
		// TODO: condition?
		for( var i in neighbors){
			//return neighbors[ i].address;
		}
		
		return parent;
	}
}