module.exports = LineEdit;

var assert = require( "assert");

var extend = require( '../util/extend');
var Widget = require( './widget');
var WidgetDescriptor = require( './widgetdescriptor');
var terminal_utils = require( 'terminal_utils');

var CP_LINEEDIT_INPUT_DATA_EVENT = "LineEditInputEvent";

var LINE_EDIT_TYPE = "LineEditType";

extend( LineEdit, Widget);

var DEFAULT_VALIDATOR = "[\\s\\S]*";

function LineEdit( widgetManager, title, defaultValue, validator){
	var self = this;
	
	var data = {
			validator: validator != null ? validator : DEFAULT_VALIDATOR,
			defaultValue: defaultValue != null ? defaultValue : "",
			currentValue: ""
	};
	
	self.descriptor = new WidgetDescriptor( title, LINE_EDIT_TYPE, data);
	
	self.getInput = function( callback){
		self.on( CP_LINEEDIT_INPUT_DATA_EVENT + "_" + self.descriptor.id, function handler( event){
			if( event.id == CP_LINEEDIT_INPUT_DATA_EVENT){
				var eventData = null;
				try{
					eventData = JSON.parse( event.data);
				} catch( err){
					console.log( "LineEdit.getInput() error: ", err);
					return;
				}
				
				if( eventData.error == null || eventData.error == 0){
					self.descriptor.data.currentValue = eventData.value;
					
					self.removeAllListeners( "close_" + self.descriptor.id);
					
					self.close( function(){
						callback( eventData ? eventData.value : null);
					});
				}
				else{
					terminal_utils.errorDialog( widgetManager, "Ошибка", "                       Введены неверные          данные", null, false);
				}
			}
		});
	};
	
	self.setValue = function( value){
		self.descriptor.data.currentValue = value;
	};
	
	self.getValue = function(){
		return self.descriptor.data.currentValue;
	};
}
