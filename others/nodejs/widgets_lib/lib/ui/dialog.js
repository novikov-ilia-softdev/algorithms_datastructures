module.exports = Dialog;

var assert = require( "assert");
var terminal_utils = require( 'terminal_utils');

var extend = require( '../util/extend');
var Widget = require( './widget');
var WidgetDescriptor = require( './widgetdescriptor');

var DIALOG_TYPE = "DialogType";

extend( Dialog, Widget);

function Dialog( title, text, buttons, position){
	var self = this;
	
	var data = {
			message: text,
			buttons: buttons
	};
	
	self.descriptor = new WidgetDescriptor( title, DIALOG_TYPE, data, position);
	
	self.onAccept = function( callback){
		if( terminal_utils.isFunction( callback))
			self.on( "accept_" + self.descriptor.id, callback);
	};
	
	self.onceAccept = function( callback){
		if( terminal_utils.isFunction( callback))
			self.once( "accept_" + self.descriptor.id, callback);
	};
	
	self.onCancel = self.onClose;
	self.onceCancel = self.onceClose;
}