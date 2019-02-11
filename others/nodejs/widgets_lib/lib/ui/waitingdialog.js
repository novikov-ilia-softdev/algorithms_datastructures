module.exports = WaitingDialog;

var assert = require( "assert");

var extend = require( '../util/extend');
var Widget = require( './widget');
var WidgetDescriptor = require( './widgetdescriptor');

var WAITING_DIALOG_TYPE = "WaitingDialogType";

extend( WaitingDialog, Widget);

function WaitingDialog( title, closable, id){
	var self = this;
	
	var data = {
			withoutCalculation: true,
			frameRate: 300,
			radius: 20,
			rotationAngle: 15,
			closable: closable
	};	 
	
	self.descriptor = new WidgetDescriptor( title, WAITING_DIALOG_TYPE, data, "center", id);
}