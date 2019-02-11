module.exports = ShowWidgetAction;

function ShowWidgetAction( widget){
	var self = this;
	
	self.widget = widget;
	
	self.execute = function(){
		self.widget.show();
	};
};