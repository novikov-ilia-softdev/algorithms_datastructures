var assert = require( "assert");

var session = require( "control_lib_js").getSession();
var WindowManager = require( "../index.js");

var SubjectMock = require( "terminal_utils").SubjectMock;
var Message = require( 'control_serialization_lib').Message;

var LOGGER_LOG_MESSAGE_ATTR_NAME = "LogMessage";
var LOGGER_ERROR_MESSAGE_ATTR_NAME = "ErrorMessage";

var CP_SHOW_WIN_ATTR_NAME = "ShowWidget";
var CP_CLOSE_WIN_ATTR_NAME = "CloseWidget";
var CP_REPAINT_WIN_ATTR_NAME = "RepaintWidget";

var CP_MENU_ITEM_ACTIVATED_EVENT = "MenuItemActivatedEvent";
var CP_LINEEDIT_INPUT_DATA_EVENT = "LineEditInputEvent";
var CP_CLOSE_WIDGET_EVENT = "CloseWidgetEvent";

describe( "Widgets test", function(){
	var widgetManager = null;
	
	var subject = null;
	
	var selfControlObject = null;
	var cpControlObject = null;
	var logModuleControlObject = null;
	
	var cpRemoteObject = null;
	var remoteSubject = null;
	var logger = null;
	
	beforeEach( function( done){
		session.start();
		
		selfControlObject = session.createControlObject( "Self", "0");
		selfControlObject.init( function( err, res){
			assert.equal( err, null);
		});
		
		cpRemoteObject = session.getRemoteObject( "LocalControlPanelModule_0", selfControlObject);
		remoteSubject = session.getRemoteSubject();
		assert.notEqual( cpRemoteObject, null);
		
		logger = require( 'log_utils');
		logger.init( session, selfControlObject);
		
		widgetManager = new WindowManager( remoteSubject, selfControlObject.name, cpRemoteObject, logger);
		
		subject = new SubjectMock();
		subject.start( function( err){
			assert.equal( err, null);
			widgetManager.init( function( err, res){
				assert.equal( err, null);
				assert.notEqual( res, null);
				assert.equal( res.result, true);
			});
		});
		
		cpControlObject = session.createControlObject( "LocalControlPanelModule", "0");
		cpControlObject.addStringAttribute( CP_SHOW_WIN_ATTR_NAME);
		cpControlObject.addStringAttribute( CP_CLOSE_WIN_ATTR_NAME);
		cpControlObject.addStringAttribute( CP_REPAINT_WIN_ATTR_NAME);
		cpControlObject.init( function( err, res){
			assert.equal( err, null);
			done();
		});
		
		logModuleControlObject = session.createControlObject( "LoggingModule", "0");
		logModuleControlObject.addStringAttribute( LOGGER_LOG_MESSAGE_ATTR_NAME);
		logModuleControlObject.addStringAttribute( LOGGER_ERROR_MESSAGE_ATTR_NAME);
		logModuleControlObject.init( function( err){
			assert.equal( err, null);
		});
//		logModuleControlObject.on( "attribute_set_LogMessage", function( attribute){
//			console.log( "[INFO]: " + attribute.attributeValue);
//		});
//		
//		logModuleControlObject.on( "attribute_set_ErrorMessage", function( attribute){
//			console.log( "[ERROR]: " + attribute.attributeValue);
//		});
	});
	
	afterEach( function( done){
		setTimeout( function(){
			session.stop();
			subject.stop();
			done();
		}, 500);
	});
	
	it( "should not change window id", function( done){
		try{
			var lineEdit = widgetManager.createLineEdit( "Some text");
			lineEdit.descriptor.id = 0;
		}
		catch( err){
			assert.notEqual( err, null);
			done();
		}
	});
	
	it( "should show Dialog", function( done){
		var text = "Some Useful Text";
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			assert.equal( descriptor.data.message, text);
			done();
		});
		
		var dialog = widgetManager.createOkDialog( "SomeTitle", text);
		dialog.show();
	});
	
	it( "should close Dialog on Enter pressed", function( done){
		var text = "Some Useful Text";
		var dialog = widgetManager.createOkDialog( "SomeTitle", text);
		
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			assert.equal( descriptor.data.message, text);
			assert.equal( descriptor.id, dialog.descriptor.id);
			
			var data = {
					widgetId: descriptor.id
			};
			
			var message  = new Message( cpControlObject.name);
			message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_CLOSE_WIDGET_EVENT, JSON.stringify( data));
			
			subject.sendNotification( selfControlObject.name, message);
		});
		
		cpControlObject.on( "attribute_set_" + CP_CLOSE_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			assert.equal( descriptor.id, dialog.descriptor.id);
			
			done();
		});
		
		dialog.show();		
	});
	
	it( "should show LineEdit", function( done){
		var lineEdit = widgetManager.createLineEdit( "SomeTitle");
		
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			assert.equal( descriptor.id, lineEdit.descriptor.id);
			done();
		});
		
		lineEdit.show();
	});
	
	it( "should get input from LineEdit", function( done){
		var inputData = "SomeInputData";
		
		var lineEdit = widgetManager.createLineEdit( "SomeTitle");
		
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			assert.equal( descriptor.id, lineEdit.descriptor.id);
			
			var eventData = {
					widgetId: descriptor.id,
					value: inputData
			};
			
			var message  = new Message( cpControlObject.name);
			message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_LINEEDIT_INPUT_DATA_EVENT, JSON.stringify( eventData));
			
			subject.sendNotification( selfControlObject.name, message);
		});
		
		lineEdit.show();
		lineEdit.getInput( function( res){
			assert.equal( res, inputData);
			done();
		});
	});
	
	it( "should close LineEdit on data entered", function( done){
		var inputData = "SomeInputData";
		var lineEdit = widgetManager.createLineEdit( "SomeTitle");
		
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			assert.equal( descriptor.id, lineEdit.descriptor.id);
			
			var eventData = {
					widgetId: descriptor.id,
					value: inputData
			};
			
			var message  = new Message( cpControlObject.name);
			message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_LINEEDIT_INPUT_DATA_EVENT, JSON.stringify( eventData));

			subject.sendNotification( selfControlObject.name, message);
		});
		
		cpControlObject.on( "attribute_set_" + CP_CLOSE_WIN_ATTR_NAME, function( attribute){ 
			var descriptor = JSON.parse( attribute.attributeValue);
			assert.equal( descriptor.id, lineEdit.descriptor.id);
			done();
		});
		
		lineEdit.show();
		lineEdit.getInput( function( res){
			assert.equal( res, inputData);
		});
		
		
	});
	
	it( "should show Menu", function( done){
		var items = [
		             { 
		            	 name: "SomeItem1"
		             },
		             {
		            	 name: "SomeItem2"
		             }
		];
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			assert.deepEqual( descriptor.data.items, items);
			done();
		});
		
		var lineEdit = widgetManager.createLineEdit( "SomeTitle", "SomeLineEdit");
		var menu = widgetManager.createMenu( "SomeTitle");
		menu.addWidgetItem( "SomeItem1", lineEdit);
		var subMenu = widgetManager.createMenu( "SomeTitle");
		menu.addSubMenu( "SomeItem2", subMenu);
		
		menu.show();
	});

	it( "should Menu activate submenu", function( done){
		var menuItems = [
		             { 
		            	 name: "SomeItem1"
		             },
		             {
		            	 name: "SomeItem2"
		             }
		];
		var subMenuItems = [
		             { 
		            	 name: "SOME_ITEM"
		             }
		];
		var lineEdit = widgetManager.createLineEdit( "SomeTitle", "SomeLineEdit");
		var menu = widgetManager.createMenu( "SomeTitle");
		menu.addWidgetItem( "SomeItem1", lineEdit);
		var subMenu = widgetManager.createMenu( "SomeTitle");
		subMenu.addWidgetItem( "SOME_ITEM", lineEdit);
		menu.addSubMenu( "SomeItem2", subMenu);
		
		var counter = 0;
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			
			if( counter == 0){
				assert.equal( descriptor.id, menu.descriptor.id);
				assert.deepEqual( descriptor.data.items, menuItems);
				
				var data = {
						widgetId: descriptor.id,
						menuItemId: "1"
				};
				
				var message  = new Message( cpControlObject.name);
				message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_MENU_ITEM_ACTIVATED_EVENT, JSON.stringify( data));
				
				subject.sendNotification( selfControlObject.name, message);
			}
			else{
				assert.equal( descriptor.id, subMenu.descriptor.id);
				assert.deepEqual( descriptor.data.items, subMenuItems);
				done();
			}
			
			counter++;
		});
		
		menu.show();
	});
	
	it( "should close submenu on activate empty item", function( done){
		var menu = widgetManager.createMenu( "SomeTitle");
		var submenu = widgetManager.createMenu( "SomeTitle");
		menu.addSubMenu( "Submenu1", submenu);
		
		submenu.addEmptyItem( "Item1");
		submenu.addEmptyItem( "Item2");
		
		var counter = 0;
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			
			if( counter == 0)
				assert.equal( descriptor.id, menu.descriptor.id);
			else
				assert.equal( descriptor.id, submenu.descriptor.id);
			
			var data = {
					widgetId: descriptor.id,
					menuItemId: "0"
			};
			
			var message  = new Message( cpControlObject.name);
			message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_MENU_ITEM_ACTIVATED_EVENT, JSON.stringify( data));
			
			subject.sendNotification( selfControlObject.name, message);			
			++counter;
		});
		
		cpControlObject.on( "attribute_set_" + CP_CLOSE_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			
			assert.equal( descriptor.id, submenu.descriptor.id);
			done();
		});
		
		menu.show();
	});
	
	it( "should done when activate \'Done\' menu item", function( done){
		var menu = widgetManager.createMenu( "SomeTitle");
		
		menu.addDoneItem( "Item1");
		
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			
			assert.equal( descriptor.id, menu.descriptor.id);
			
			var data = {
					widgetId: descriptor.id,
					menuItemId: "0"
			};
			
			var message  = new Message( cpControlObject.name);
			message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_MENU_ITEM_ACTIVATED_EVENT, JSON.stringify( data));
			
			subject.sendNotification( selfControlObject.name, message);
		});
		
		menu.once( "done_" + menu.descriptor.id, function(){
			done();
		});
		menu.show();
	});
	
	it( "should set attribute when activate \"Attribute\" menu item", function( done){
		var controlObjectName = "SomeControlObject";
		var controlObjectId = "123456";
		var attributeName = "SomeAttribute";
		var expectedAttributeValue = "expectedValue";
		
		
		var someControlObject = session.createControlObject( controlObjectName, controlObjectId);
		someControlObject.addStringAttribute( attributeName);
		someControlObject.init( function( err, res){
			assert.equal( err, null);
		});
		
		someControlObject.on( "attribute_set_" + attributeName, function( attribute){
			assert.equal( attribute.attributeValue, expectedAttributeValue);
		});
		
		var someRemoteObject = session.getRemoteObject( controlObjectName + "_" + controlObjectId, selfControlObject);
		
		var menu = widgetManager.createMenu( "SomeTitle");
		menu.addSetAttributeItem( "SomeItem", someRemoteObject, attributeName, expectedAttributeValue, function( err, res){
			assert.equal( err, null);
			assert.equal( res, expectedAttributeValue);
			done();
		});
		
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			
			assert.equal( descriptor.id, menu.descriptor.id);
			
			var data = {
					widgetId: descriptor.id,
					menuItemId: "0"
			};
			
			var message  = new Message( cpControlObject.name);
			message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_MENU_ITEM_ACTIVATED_EVENT, JSON.stringify( data));
			
			subject.sendNotification( selfControlObject.name, message);
		});
		
		menu.show();
	});	
	
	it( "should replace widget menu item", function( done){
		var lineEditId = null;
		var menuId = null;
		
		var lineEdit = widgetManager.createLineEdit( "SomeTitle", "SomeLineEdit");
		var dialog = widgetManager.createOkDialog( "SomeDialogTitle", "SomeDialogText");
		var menu = widgetManager.createMenu( "SomeTitle");
		var subMenu = widgetManager.createMenu( "SomeTitle");
		
		var replaceableItemId = menu.addWidgetItem( "SomeItem1", lineEdit);
		menu.addSubMenu( "SomeItem2", subMenu);
		
		cpControlObject.on( "attribute_set_" + CP_REPAINT_WIN_ATTR_NAME, function( attribute){
			selectMenuItem( menuId, 0);
		});
		
		var showCounter = 0;
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			
			if( showCounter == 1){
				assert.equal( descriptor.type, "LineEditType");
				lineEditId = descriptor.id;
				
				menu.replaceWidgetItem( replaceableItemId, "SomeDifferentItem", dialog);
				menu.repaint();
			}
			else if( showCounter == 2){
				assert.notEqual( descriptor.id, lineEditId);
				assert.equal( descriptor.type, "DialogType");
				done();
			}
			else{
				menuId = descriptor.id;
				selectMenuItem( descriptor.id, "0");
			}
			
			showCounter++;
		});
		
		setTimeout( function(){
			menu.show();
		}, 100);
	});
	
	it( "should change widget title of menu item", function( done){
		var otherLineEditTitle = "SOME_DIFFERENT_TITLE";
		var menu = widgetManager.createMenu( "MenuTitle");
		var lineEdit = widgetManager.createLineEdit( "LineEditTitle", "default line edit value");
		
		menu.addWidgetItem( "Input", lineEdit);
		
		
		var showCounter= 0;
		cpControlObject.on( "attribute_set_" + CP_SHOW_WIN_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue);
			
			if( showCounter == 0){
				lineEdit.setTitle( otherLineEditTitle);
				selectMenuItem( descriptor.id, 0);
			}
			else{
				assert.equal( descriptor.title, otherLineEditTitle);
				done();
			}
			
			showCounter++;
		});
		
		menu.show();
	});
	
	function selectMenuItem( menuId, itemId){
		var data = {
				widgetId: menuId,
				menuItemId: itemId
		};

		var message  = new Message( cpControlObject.name);
		message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_MENU_ITEM_ACTIVATED_EVENT, JSON.stringify( data));
		
		subject.sendNotification( selfControlObject.name, message);
	};
});
