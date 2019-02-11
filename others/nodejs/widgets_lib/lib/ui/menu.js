module.exports = Menu;

var assert = require( 'assert');

var extend = require( '../util/extend');
var idgenerator = require( 'idgenerator');
var terminal_utils = require( 'terminal_utils');
var Widget = require( './widget');
var WidgetDescriptor = require( './widgetdescriptor');

var MenuItem = require( './menuitem');
var SendEventAction = require( './sendeventaction');
var ShowWidgetAction = require( './showwidgetaction');
var EmptyAction = require( './emptyaction');
var DoneAction = require( './doneaction');
var SetAttributeAction = require( './setattributeaction');

var MENU_TYPE = "MenuType";
var CP_MENU_ITEM_ACTIVATED_EVENT = "MenuItemActivatedEvent";

extend( Menu, Widget);

function Menu( title, position){
	var self = this;
	
	self.descriptor = new WidgetDescriptor( title, MENU_TYPE, "", position);

	var menuItems = [];
	
	Object.defineProperty( self.descriptor, "data", {
		get: function(){
			var data = {
					items: []
			};
			menuItems.forEach( function( menuItem){
				var item = {
						name: menuItem.data
				};
				data.items.push( item);
			});
			
			return data;
		},
		set: function( value){ 
			assert( false, "Menu: setting text to Menu is deprecated");
		}
	});
	
	self.clear = function(){
		delete menuItems;
		menuItems = [];
	};
	
	self.itemsCount = function(){
		return menuItems.length;
	};
	
	self.itemAt = function( index){
        if( index <= 0 && index > menuItems.length)
            return;
        
		return menuItems[ index];
	};

	self.deleteMenuItem = function( index){
        if( index <= 0 && index > menuItems.length)
            return;
        
		menuItems.splice( index, 1);
	};
	
	self.deleteMenuItems = function( index, count){
        if( index <= 0 && index > menuItems.length)
            return;
        
		menuItems.splice( index, count);
	};
	
	self.activateItem = function( id){
		if( id < 0 || id > menuItems.length - 1)
            return;
		
		menuItems[ id].activate();
		self.emit( 'itemActivated_' + self.descriptor.id, menuItems[ id], id);
		self.emit( 'itemActivated_' + self.descriptor.id + "_" + id, menuItems[ id], id);
	};
	
	self.onceActivateItem = function( id, callback){
		if( terminal_utils.isFunction( callback))
			self.once( 'itemActivated_' + self.descriptor.id + "_" + id, callback);
	};
	
	self.onActivateItem = function( id, callback){
		if( terminal_utils.isFunction( callback))
			self.on( 'itemActivated_' + self.descriptor.id + "_" + id, callback);
	};
	
	self.onActivate = function( callback){
		if( terminal_utils.isFunction( callback))
			self.on( 'itemActivated_' + self.descriptor.id, callback);
	};
	
	self.onceDone = function( callback){
		if( terminal_utils.isFunction( callback))
			self.once( 'done_' + self.descriptor.id, callback);
	};
	
	self.onDone = function( callback){
		if( terminal_utils.isFunction( callback))
			self.on( 'done_' + self.descriptor.id, callback);
	};
	
	self.onceClose = function( callback){
		if( terminal_utils.isFunction( callback))
			self.once( 'close_' + self.descriptor.id, callback);
	};
	
	self.onClose = function( callback){
		if( terminal_utils.isFunction( callback))
			self.on( 'close_' + self.descriptor.id, callback);
	};
	
	self.addSubMenu = function( text, menu, index){
		assert( menu instanceof Menu);
		
		var action = new ShowWidgetAction( menu);
		return addMenuItem( text, action, index);
	};
	
	self.addWidgetItem = function( text, window, index){
		assert( window instanceof Widget);
		
		var action = new ShowWidgetAction( window);
		return addMenuItem( text, action, index);
	};
	
	self.addEventItem = function( text, controlObjectName, event, subject, index){
		var action = new SendEventAction( self, controlObjectName, event, subject);
		return addMenuItem( text, action, index);
	};
	
	self.addEmptyItem = function( text, closable, index){
		var action = new EmptyAction( self, closable);
		return addMenuItem( text, action, index);
	};
	
	self.addDoneItem = function( text, closable, index){
		var action = new DoneAction( self, closable);
		return addMenuItem( text, action, index);
	};
	
	self.addSetAttributeItem = function( text, remoteObject, attributeName, value, setCallback, index, closable){
		var action = new SetAttributeAction( self, remoteObject, attributeName, value, setCallback, closable);
		return addMenuItem( text, action, index);
	};
	
	self.replaceWidgetItem = function( id, text, widget){
		assert( widget instanceof Widget);
		
		var action = new ShowWidgetAction( widget);
		return replaceMenuItem( id, text, action); 
	};
	
	self.replaceSetAttributeItem = function( id, text, remoteObject, attributeName, value, setCallback){
		var action = new SetAttributeAction( remoteObject, attributeName, value, setCallback);
		return replaceMenuItem( id, text, action);
	};
	
	function addMenuItem( text, action, index){
		var id = index == null ? menuItems.length : index;
		menuItems.splice( id, 0, new MenuItem( text, action));
		return menuItems.length - 1;
	};
	
	function replaceMenuItem( id, text, action){
		menuItems[ id] = new MenuItem( text, action);
		return id;
	};

	self.replaceEmptyItem = function( id, text, closable){
		var action = new EmptyAction( self, closable);
		return replaceMenuItem( id, text, action);
	};
	
}