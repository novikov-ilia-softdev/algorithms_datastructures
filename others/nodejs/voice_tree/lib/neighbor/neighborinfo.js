module.exports = NeighborInfo;
var Wave = require( '../wave/wave');
var NodeState = require( '../wave/nodestate');

function NeighborInfo( neighborNodeState, neighborAddress){
	var self = this;
	
	var initiator = null;
	if( neighborNodeState.hasOwnProperty( "wave") && neighborNodeState.wave.hasOwnProperty( "initiator"))
		initiator = neighborNodeState.wave.initiator;
	
	var waveCount = null;
	if( neighborNodeState.hasOwnProperty( "wave") && neighborNodeState.wave.hasOwnProperty( "waveCount"))
		waveCount = neighborNodeState.wave.waveCount;
	
	var state = null;
	if( neighborNodeState.hasOwnProperty( "wave") && neighborNodeState.wave.hasOwnProperty( "state"))
		state = neighborNodeState.wave.state;
	
	var wave = new Wave( initiator, waveCount, state);
	
	var levelFromInitiator = null;
	if( neighborNodeState.hasOwnProperty( "levelFromInitiator"))
		levelFromInitiator = neighborNodeState.levelFromInitiator;
	
	self.nodeState = new NodeState( wave, levelFromInitiator);
	
	self.address = neighborAddress;
	self.recvTime = new Date();
	self.inactiveTimeMs = 0;
}