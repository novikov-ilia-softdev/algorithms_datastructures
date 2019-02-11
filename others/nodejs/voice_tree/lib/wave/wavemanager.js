var timeSettings = require( '../timesettings/timesettings');
var Wave = require( './wave');
var NodeState = require( './nodestate');
var states = require( './states');
var NeighborInfo = require( '../neighbor/neighborinfo');

module.exports = WaveManager;

function WaveManager( module){
	var _self = this;
	_self.module = module;
	_self.isInit = false;
	_self.levelFromInitiator = -1;
	_self.waveCount = 0;
	_self.state = states.noState;
	_self._generatingWavesInterval = null;
	
	// +
	_self.init = function(){
		_self.runSendNodeState();
		setInterval( _self.runSendNodeState, timeSettings.sendNodeStateIntervalMs);
		_self.isInit = true;
	}
	
	// -
	_self.runSendNodeState = function(){
		var wave = new Wave( _self.module.initiatorManager.getInitiator(), _self.waveCount, _self.state);
		var nodeState = new NodeState( wave, _self.levelFromInitiator);
		_self.module.netManager.broadcastSend( JSON.stringify( nodeState));
	}
	
	// +
	_self.generateNewWave = function(){
		_self.state = states.grayState;
		_self.levelFromInitiator = 0;
		_self.waveCount++;
	}
	
	// +
	_self.getCurrentWave = function(){
		return new Wave( _self.module.initiatorManager.getInitiator(), _self.waveCount, _self.state);
	}
	
	// +
	_self.getCurrentState = function(){
		return _self.state;
	}
	
	// +
	_self.setCurrentState = function( state){
		_self.state = state;
	}
	
	// +
	_self.getNodeState = function(){
		var wave = new Wave( _self.module.initiatorManager.getInitiator(), _self.waveCount, _self.state);
		var nodeState = new NodeState( wave, _self.levelFromInitiator);
		return nodeState;
	}
	
	// +
	_self.handleMessage = function( msg, rinfo){
		if( !_self.module.neighborManager.isNeighbor( rinfo.address))
			return false;
		
		var neighborNodeState;
		
		try{
			neighborNodeState = JSON.parse( msg.toString());
		}
		catch( ex){
			return false;
		}
		
		neighborInfo = new NeighborInfo( neighborNodeState, rinfo.address);
		
		if( neighborInfo.nodeState.wave.initiator != _self.module.initiatorManager.getInitiator()){
			_self.module.logger.logMessage( "wrong initiator!");
			return false;
		}
		
		if( _self.waveCount == neighborInfo.nodeState.wave.waveCount){
			_self.module.logger.logMessage( "already handled this wave!");
			return false;
		}
		
		_self.waveCount = neighborInfo.nodeState.wave.waveCount;
		_self.state = neighborInfo.nodeState.wave.state;
		_self.levelFromInitiator = neighborInfo.nodeState.levelFromInitiator + 1;
		
		return true;
	}
	
	// +
	_self.startGeneratingNewWaves = function(){
		_self.startNewWave();
		_self._generatingWavesInterval = setInterval( _self.startNewWave, timeSettings.generateWaveIntervalMs);
	}
	
	_self.stopGeneratingNewWaves = function(){
		if( _self._generatingWavesInterval){
			clearInterval( _self._generatingWavesInterval);
			_self._generatingWavesInterval = null;
		}
	}
	
	// -
	_self.startNewWave = function(){
		_self.module.logger.logMessage( "");
		_self.module.logger.logMessage( "generating new wave...");
		_self.generateNewWave();
		_self.module.neighborManager.notifyTwoNeighbors();
		
		setTimeout( function(){
			if( !_self.module.initiatorManager.isInitiator())
				return;
				
			_self.state = states.greenState;
			_self.module.logger.logMessage( "changing self state: " + JSON.stringify( _self.module.waveManager.getCurrentWave()));
		}, timeSettings.waveSpreadTimeoutMs)
	}
}