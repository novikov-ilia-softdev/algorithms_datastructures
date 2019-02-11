module.exports = LineEditDataEvent;

function LineEditDataEvent( controlEvent){
	var self = this;
	
	self.controlEvent = controlEvent;
	
	self.process = function( lineEdit){
		lineEdit.emit( self.controlEvent.id + "_" + lineEdit.descriptor.id, self.controlEvent);
	};
};