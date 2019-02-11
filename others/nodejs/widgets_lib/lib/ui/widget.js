module.exports = Widget;

var assert = require( 'assert');
var EventEmitter = require( 'events').EventEmitter;

var extend = require( '../util/extend');
var sharedObjectProvider = require( '../util/sharedobjectprovider');
var WidgetDescriptor = require( './widgetdescriptor');
var terminal_utils = require( 'terminal_utils');

var CP_SHOW_WIN_ATTR_NAME = "ShowWidget";
var CP_CLOSE_WIN_ATTR_NAME = "CloseWidget";
var CP_REPAINT_WIN_ATTR_NAME = "RepaintWidget";

var CP_CLOSE_WIDGET_EVENT = "CloseWidgetEvent";

var EVENT_EMITTER_MAX_LISTENERS_COUNT = 32;

var WIDGET_TYPE = "WidgetType";
var LIGHT_MENU_TYPE = "DisplasedWidgetType";

extend( Widget, EventEmitter);

function Widget( text, position, id){
	var self = this;

	self.descriptor = new WidgetDescriptor( "", WIDGET_TYPE, text, position, id);
	self.setMaxListeners( EVENT_EMITTER_MAX_LISTENERS_COUNT);
	self.isClosed = true;
}

Widget.prototype.show = function( callback){
	this.isClosed = false;

	var cpRemoteObject = sharedObjectProvider.cpRemoteObject;
	assert( cpRemoteObject, "LocalControlPanelModule_0 Remote Object not initialized");
	assert( sharedObjectProvider.logger);
	assert( sharedObjectProvider.attributeHelper);

	if( !this.attributeHelper)
		this.attributeHelper = sharedObjectProvider.attributeHelper;
	this.attributeHelper.setAttr( cpRemoteObject, CP_SHOW_WIN_ATTR_NAME, JSON.stringify( this.descriptor), callback);
};

Widget.prototype.close = function( callback){
	if( this.isClosed) {
		if( terminal_utils.isFunction( callback))
			callback();
		return;
	}
	var cpRemoteObject = sharedObjectProvider.cpRemoteObject;
	assert( cpRemoteObject, "LocalControlPanelModule_0 Remote Object not initialized");
	assert( sharedObjectProvider.logger);

	var self = this;

	if( !self.attributeHelper)
		self.attributeHelper = sharedObjectProvider.attributeHelper;
	self.attributeHelper.setAttr( cpRemoteObject, CP_CLOSE_WIN_ATTR_NAME, JSON.stringify( self.descriptor), function( err, res){
		self.isClosed = true;

		self.emit( "close_" + self.descriptor.id);

		if( terminal_utils.isFunction( callback))
			callback( err, res);
	});
};

Widget.prototype.repaint = function( callback){
	var cpRemoteObject = sharedObjectProvider.cpRemoteObject;
	assert( cpRemoteObject, "LocalControlPanelModule_0 Remote Object not initialized");
	assert( sharedObjectProvider.logger);

	if( !this.attributeHelper)
		this.attributeHelper = sharedObjectProvider.attributeHelper;
	this.attributeHelper.setAttr( cpRemoteObject, CP_REPAINT_WIN_ATTR_NAME, JSON.stringify( this.descriptor), callback);
};

Widget.prototype.setTitle = function( title){
	this.descriptor.title = title;
};

Widget.prototype.handleEvent = function( event){
	var self = this;

	if( self.descriptor.type == LIGHT_MENU_TYPE)
		return;

	event.process( this);
};

Widget.prototype.onceClose = function( callback){
	if( terminal_utils.isFunction( callback)){
		this.once( "close_" + this.descriptor.id, callback);
	}
};

Widget.prototype.onClose = function( callback){
	if( terminal_utils.isFunction( callback)){
		this.on( "close_" + this.descriptor.id, callback);
	}
};