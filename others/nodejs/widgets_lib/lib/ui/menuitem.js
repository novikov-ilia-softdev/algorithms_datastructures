module.exports = MenuItem;

function MenuItem( data, action){
	var self = this;
	
	self.data = data;
	self.action = action;
	
	self.activate = function(){
		self.action.execute();
	};
}