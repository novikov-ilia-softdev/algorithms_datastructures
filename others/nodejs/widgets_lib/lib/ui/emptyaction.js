module.exports = EmptyAction;

function EmptyAction( menu, closable){
	this.menu = menu;
	// default value is true
	this.closable = closable == null ? true : closable;
	
	this.execute = function(){
		if( this.closable)
			menu.close();
	};
}