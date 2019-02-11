var MenuItemActivatedEvent = require( './menuitemactivatedevent');
var LineEditDataEvent = require( './lineeditdataevent');
var CloseWidgetEvent = require( './closewidgetevent');
var AcceptDialogWidgetEvent = require( './acceptdialogwidgetevent');
var ScaleInputWidgetEvent = require( './scaleinputwidgetevent');

var CP_MENU_ITEM_ACTIVATED_EVENT = "MenuItemActivatedEvent";
var CP_LINEEDIT_INPUT_DATA_EVENT = "LineEditInputEvent";
var CP_CLOSE_WIDGET_EVENT = "CloseWidgetEvent";
var CP_ACCEPT_DIALOG_EVENT = "AcceptDialogWidgetEvent";
var CP_SCALE_INPUT_EVENT = "ScaleInputEvent";

var creatorFunctions = {};

registrateEvent( CP_MENU_ITEM_ACTIVATED_EVENT, MenuItemActivatedEvent);
registrateEvent( CP_LINEEDIT_INPUT_DATA_EVENT, LineEditDataEvent);
registrateEvent( CP_CLOSE_WIDGET_EVENT, CloseWidgetEvent);
registrateEvent( CP_ACCEPT_DIALOG_EVENT, AcceptDialogWidgetEvent);
registrateEvent( CP_SCALE_INPUT_EVENT, ScaleInputWidgetEvent);

module.exports.createWidgetEvent = function( event){
	if( creatorFunctions.hasOwnProperty( event.id))
		return creatorFunctions[ event.id].call( this, event);
};

function registrateEvent( controlEventType, WidgetEventType){
	creatorFunctions[ controlEventType] = createEvent.bind( this, WidgetEventType);
};

function createEvent( WidgetEventType, event){
	return new WidgetEventType( event);
};
