module.exports = InformationDialog;

var assert = require( "assert");

var extend = require( '../util/extend');
var Widget = require( './widget');
var WidgetDescriptor = require( './widgetdescriptor');

var INFORMATION_DIALOG_TYPE = "InformationDialogType";

extend( InformationDialog, Widget);

function InformationDialog( title, text, position){
	var self = this;
	
	var data = {
			message: text
	};
	
	self.descriptor = new WidgetDescriptor( title, INFORMATION_DIALOG_TYPE, data, position);
}