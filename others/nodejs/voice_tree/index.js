var Module = require( 'module_application');
var Logger = require( './lib/log/logger');
var InitiatorManager = require( './lib/initiator/initiatormanager');
var NetManager = require( './lib/net/netmanager');
var WaveManager = require( './lib/wave/wavemanager');
var NeighborManager = require( './lib/neighbor/neighbormanager');
var ParentManager = require( './lib/parent/parentmanager');
var events = require( './lib/event/events');
var timeSettings = require( './lib/timesettings/timesettings');
var attributes = require( './lib/control/attributes');
var controlEvents = require( './lib/control/events');
var states = require( './lib/wave/states');

var module = new Module();

module.on( "run", function(){
	module.logger = new Logger();
	module.logger.init();
	
	module.parentAddressAsked = false;
	module.handleWaveMessageInProgress = false;
	module.prevWaveCount = null;
	
	module.logger.logMessage( "module started");
	
	module.netManager = new NetManager( module);
	module.initiatorManager = new InitiatorManager( module);
	module.waveManager = new WaveManager( module);
	module.neighborManager = new NeighborManager( module);
	module.parentManager = new ParentManager( module);
	
	module.netManager.init( function(){
		module.initiatorManager.init();
		module.waveManager.init();
		module.neighborManager.init();
	});
	
	module.netManager.on( events.nodeStatusMessage.name, function( msg, rinfo){
		module.neighborManager.handleMessage( msg, rinfo);
	});
	
	module.netManager.on( events.waveMessage.name, function( msg, rinfo){
		if( module.initiatorManager.isInitiator())
			return;
		
		module.logger.logMessage( "");
		module.logger.logMessage( "message " + msg.toString() + " from " + rinfo.address);
		
		if( module.handleWaveMessageInProgress){
			module.logger.logMessage( "handleWaveMessageInProgress");
			return;
		}
		
		module.handleWaveMessageInProgress = true;
		
		setTimeout( function(){
			if( !module.waveManager.handleMessage( msg, rinfo)){
				module.handleWaveMessageInProgress = false;
				return;
			}
			
			module.parentManager.setParent( rinfo.address);
			
			setTimeout( function(){
				module.neighborManager.notifyTwoNeighbors( rinfo.address);
				module.handleWaveMessageInProgress = false;
				
			}, timeSettings.updateNeighborsInfoTimeoutMs);
			
		}, timeSettings.updateNeighborsInfoTimeoutMs);
	});
	
	module.initiatorManager.on( events.selfStartedInitiator.name, function(){
		module.parentManager.setParent( null);
		setTimeout( function(){
			
			if( !module.initiatorManager.isInitiator())
				return;
			
			module.waveManager.startGeneratingNewWaves();
			module.prevWaveCount = null;
		}, timeSettings.updateNeighborsInfoTimeoutMs);
	});
	
	module.initiatorManager.on( events.selfEndedInitiator.name, function(){
		
		setTimeout( function(){
			module.waveManager.stopGeneratingNewWaves();
			
			if( module.waveManager.getCurrentState() == states.grayState)
				module.waveManager.setCurrentState( states.greenState);
			
		}, timeSettings.updateNeighborsInfoTimeoutMs);
	});
	
	module.neighborManager.on( events.lostConnectionWithParent.name, function(){
		module.logger.logMessage( "lost connection with parent " + module.parentManager.getParent());
		var parent = module.parentManager.findNewParent();
		
		if( module.waveManager.getCurrentState() == states.grayState)
			module.waveManager.setCurrentState( states.greenState);
		
		module.logger.logMessage( "new parent is " + parent);
		if( parent)
			module.parentManager.setParent( parent);
	});
	
	module.neighborManager.on( events.lostConnectionWithPrevParent.name, function(){
		module.logger.logMessage( "lost connection with prev parent " + module.parentManager.getPrevParent());
		var parent = module.parentManager.findNewParent();
		module.logger.logMessage( "new prev parent is " + parent);
		if( parent)
			module.parentManager.setPrevParent( parent);
	});
	
	module.neighborManager.on( events.parentChangedColour.name, function( currentWave){
		//module.logger.logMessage( "module.neighborManager.on( events.parentChangedColour");
		//module.logger.logMessage( "currentWave: " + JSON.stringify( currentWave));
		//module.logger.logMessage( "module.prevWaveCount: " + module.prevWaveCount);
		
		module.parentManager.setPrevParent( null);
		
		if( currentWave.waveCount != module.prevWaveCount){
			module.logger.logMessage( "parentChangedColour: " + module.parentManager.getParent());
			module.notify( controlEvents.parentChangedColour.name, module.parentManager.getParent());
			module.prevWaveCount = currentWave.waveCount;
		}
		
		if( !module.parentAddressAsked){
			module.waveManager.setCurrentState( states.greenState);
		}
	});
	
	module.parentManager.on( events.parentChanged.name, function( parentAddress){
		//module.logger.logMessage( "parentChanged " + JSON.stringify( arguments));
		module.notify( controlEvents.parentAddressChanged.name, parentAddress);
	});
	
	module.parentManager.on( events.prevParentChanged.name, function( prevParentAddress){
		//module.notify( controlEvents.prevParentAddressChanged.name, prevParentAddress);
	});
	
	module.initControlApi();
});

module.initControlApi = function(){
	module.controlObject.addFunctionAttribute( attributes.parentAddress.name, null, function(){
		module.parentAddressAsked = true;
		return String(module.parentManager.getParent());
	});
	
	module.controlObject.addFunctionAttribute( attributes.changeColour.name, function(){
		module.waveManager.setCurrentState( states.greenState);
	}, null);
};

module.run( module.getControlObjectNames().voiceTree);