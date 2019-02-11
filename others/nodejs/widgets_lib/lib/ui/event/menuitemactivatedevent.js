module.exports = MenuItemActivatedEvent;

function MenuItemActivatedEvent( controlEvent){
	var self = this;
	
	var _controlEvent = controlEvent;
	
	self.process = function( menu){
		var eventData = null;
		try{
			eventData = JSON.parse( _controlEvent.data);
		} catch( err){}
		
		if( eventData)
			menu.activateItem( eventData.menuItemId);
	};
};