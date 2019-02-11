module.exports = SendEventAction;

function SendEventAction( menu, controlObjectName, eventId, subject){
	var self = this;
	self.menu = menu;
	
	self.execute = function(){
		//self.menu.close( function(){
			subject.notify( controlObjectName, eventId);
		//});
	};
};