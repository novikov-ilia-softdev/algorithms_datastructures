module.exports = Wave;

function Wave( initiator, waveCount, state){
	var self = this;
	
	self.initiator = initiator;
	self.waveCount = waveCount;
	self.state = state;
}