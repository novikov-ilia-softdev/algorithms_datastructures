module.exports = ScaleInputWidgetEvent;

function ScaleInputWidgetEvent( controlEvent){
	var self = this;
	
	self.controlEvent = controlEvent;
	
	self.process = function( scale){
		scale.emit( self.controlEvent.id + "_" + scale.descriptor.id, self.controlEvent);
	};
};