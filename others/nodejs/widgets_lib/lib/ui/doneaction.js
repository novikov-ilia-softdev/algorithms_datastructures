module.exports = DoneAction;

function DoneAction( menu, closable){
	var self = this;

	var _menu = menu;
	// default value is true
	this.closable = closable == null ? true : closable;
	
	self.execute = function(){
		if( this.closable){
			_menu.close( function(){
				_menu.emit( "done_" + _menu.descriptor.id);
			});
		}
		else
			_menu.emit( "done_" + _menu.descriptor.id);
	};
};