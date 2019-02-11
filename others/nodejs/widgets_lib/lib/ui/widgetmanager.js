module.exports = WidgetManager;

var ControlSerialization = require( 'control_serialization_lib');
var MessageSerializer = ControlSerialization.MessageSerializer;
var EventHelper = ControlSerialization.EventHelper;

var controlObjectNames = require( 'control_lib_js').getControlObjectNameHelper().names;
var terminal_utils = require( 'terminal_utils');

var AttributeHelper = require( 'attribute_helper');
var sharedObjectProvider = require( "../util/sharedobjectprovider");
var widgetEventFactory = require( "./event/widgeteventfactory");
var Widget = require( "./widget");
var InformationDialog = require( "./informationdialog");
var Dialog = require( "./dialog");
var LineEdit = require( "./lineedit");
var Menu = require( "./menu");
var LightMenu = require( "./lightmenu");
var Scale = require("./scale");
var WaitingDialog = require("./waitingdialog");

var DEFAULT_WIDGET_OFFSET = 8;

var positions = {
		TOP: "top",
		CENTER: "center",
		BOTTOM: "bottom"
};

function WidgetManager( subject, controlObjectName, cpRemoteObject, logger){
	var self = this;

	sharedObjectProvider.cpRemoteObject = cpRemoteObject;
	sharedObjectProvider.logger = logger;
	sharedObjectProvider.attributeHelper = new AttributeHelper( sharedObjectProvider.logger);
	
	self.widgets = {};
	self.bottomWidgetsStack = [];
	
	// callback is function( err, res){}
	self.init = function( callback){
		var subscribed = false;
		var messageSerializer = new MessageSerializer();

		var events = [];
		events.push( EventHelper.createEvent( controlObjectNames.localControlPanel));

		subject.subscribe( controlObjectName, events, function( err, res, notification){
			if( !subscribed){
				subscribed = true;
				callback( err, res);
			}

			if( notification != null){
				var message = messageSerializer.parseFromBuffer( notification.message);

				if( message.call != null){
					if( message.call.event != null && message.call.event.sourceObject == controlObjectNames.localControlPanel)
						handleEvent( message.call.event);
				}
			}
		});

	};

	self.createWidget = function( text, position, id){
		var widget = new Widget( text, position, id);
		self.widgets[ widget.descriptor.id] = widget;
		
		return widget;
	};
	
	self.createInformationDialog = function( title, text){
		var dialog = new InformationDialog( title, text);
		self.widgets[ dialog.descriptor.id] = dialog;
		
		return dialog;
	};
	
	self.createOkDialog = function( title, text){
		var dialogButtons = [ 
		    {
		    	name: "Принять"
		    }
		];
		var dialog = new Dialog( title, text, dialogButtons);
		self.widgets[ dialog.descriptor.id] = dialog;
		
		return dialog;
	};
	
	self.createOkCancelDialog = function( title, text){
		var dialogButtons = [ 
		    {
		    	name: "Принять"
		    },
		    {
		    	name: "Отклонить"
		    }
		];
		var dialog = new Dialog( title, text, dialogButtons);
		self.widgets[ dialog.descriptor.id] = dialog;
		
		return dialog;
	};
	
	self.createLineEdit = function( title, defaultValue, validator){
		var lineEdit = new LineEdit( this, title, defaultValue, validator);
		self.widgets[ lineEdit.descriptor.id] = lineEdit;
		
		return lineEdit;
	};

	self.createScale = function( title, min, max, step, current){
		var scale = new Scale( this, title, min, max, step, current);
		self.widgets[ scale.descriptor.id] = scale;
		return scale;
	};
	
	self.createMenu = function( title){
		var menu = new Menu( title);
		self.widgets[ menu.descriptor.id] = menu;
		
		return menu;
	};
	
	self.createLightMenu = function( title){
		var menu = new LightMenu( title);
		self.widgets[ menu.descriptor.id] = menu;
		
		return menu;
	};
	
	self.createWaitingDialog = function( title, closable, id){
		var dialog = new WaitingDialog( title, closable, id);
		self.widgets[ dialog.descriptor.id] = dialog;
		
		return dialog;
	};

	self.startWidgetSequence = function() {
		self.bottomWidgetsStack.push( self.widgets);
		self.widgets = {};
	};

	self.stopWidgetSequence = function(finishCallback) {
		var ids = Object.getOwnPropertyNames(self.widgets);
		var widgetsToClose = self.widgets;
		self.widgets = self.bottomWidgetsStack.pop();
		setTimeout( finishCallback, 0);
		(function doWork() {
			if( ids.length != 0) {
				var widget = widgetsToClose[ids.pop()];
				if(widget && (widget instanceof Widget)) {
					widget.close(function () {
						doWork();
					});
				} else {
					setTimeout( doWork, 0);
				}
			}
		})();
	};

	self.closeAll = function(callback) {
		var widgetsToClose = [];
		for(var id in self.widgets) {
			if( self.widgets.hasOwnProperty( id) && (self.widgets[ id] instanceof Widget)) {
				widgetsToClose.push( self.widgets[ id]);
			}
		}
		for( var i = 0; i < self.bottomWidgetsStack.length; ++i) {
			for(id in self.bottomWidgetsStack[i]) {
				if (self.bottomWidgetsStack[i].hasOwnProperty(id) && (self.bottomWidgetsStack[i][id] instanceof Widget)) {
					widgetsToClose.push(self.bottomWidgetsStack[i][id]);
				}
			}
		}
		self.widgets = {};
		self.bottomWidgetsStack = [];

		var j = 0;
		(function doWork() {
			if( j < widgetsToClose.length) {
				var widget = widgetsToClose[j];
				widget.close(function () {
					++j;
					doWork();
				});
			} else {
				callback();
			}
		})();
	};
	
	function handleEvent( event){
		logger.logAboutEvent( event, handleEventImpl.bind( self, event));
	}
	
	function handleEventImpl( event){
		if( !event.data)
			return;
		
		var eventData = null;
		try{
			eventData = JSON.parse( event.data);
		}
		catch( err)
		{
			console.error( "WidgetManager.handleEvent() error: ", err);
		}
		
		if( !eventData || !eventData.widgetId)
			return;

		var widgetEvent = widgetEventFactory.createWidgetEvent( event);

		if( self.widgets.hasOwnProperty( eventData.widgetId))
			self.widgets[ eventData.widgetId].handleEvent( widgetEvent);
	}
}

WidgetManager.TOP = positions.TOP;
WidgetManager.CENTER = positions.CENTER;
WidgetManager.BOTTOM = positions.BOTTOM;

