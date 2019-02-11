module.exports = WidgetDescriptor;

var idgenerator = require( 'idgenerator');

function WidgetDescriptor( title, type, data, position, idArg){
	var self = this;
	
	var id = idArg ? idArg : idgenerator.generate();
	
	Object.defineProperty( this, "id", {
		get: function(){ return id; },
		set: function( value){ 
			assert( false, "WidgetDescriptor: setting id is deprecated");
		},
		enumerable: true
	});
	
	self.title = title;
	self.type = type;
	self.position = position != null ? position : WidgetDescriptor.CENTER;
	self.data = data;
}

WidgetDescriptor.TOP = "top";
WidgetDescriptor.CENTER = "center";
WidgetDescriptor.BOTTOM = "bottom";