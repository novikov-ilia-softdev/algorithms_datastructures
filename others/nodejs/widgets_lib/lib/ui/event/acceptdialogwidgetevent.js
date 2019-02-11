module.exports = AcceptDialogWidgetEvent;

function AcceptDialogWidgetEvent( controlEvent){
	var self = this;
	
	self.process = function( dialog){
		dialog.emit( "accept_" + dialog.descriptor.id);
	};
};