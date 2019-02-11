module.exports = CloseWidgetEvent;

function CloseWidgetEvent( controlEvent){
	var self = this;
	
	self.process = function( widget){
		widget.close();
	};
};