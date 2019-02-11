var EventEmitter = require('events').EventEmitter;
var util = require('util');

var MessageExchanger =  require( '../messageexchange/messageexchanger');
var configHelper = require( '../config/confighelper');

var MessageSerializer = require( 'control_serialization_lib').MessageSerializer;
var Message = require( 'control_serialization_lib').Message;
var PresenceMessage = require( 'control_serialization_lib').Presence;

var Attribute = require( '../attribute/attribute');
var FunctionAttribute = require( '../attribute/functionattribute.js');
var BoolAttributeType = require( '../attribute/boolattributetype');
var StringAttributeType = require( '../attribute/stringattributetype');
var errorHelper = require('./errorhelper');
var callbackHelper = require( '../utils/callbackhelper');
var ControlCacher = require( './controlcacher');

var MessageLogger = require( './../log/messagelogger');

var messageLogger = new MessageLogger();

module.exports = ControlObject;

ATTRIBUTE_SET_PREFIX = "attribute_set";
ATTRIBUTE_GET_PREFIX = "attribute_get";

util.inherits( ControlObject, EventEmitter);

function ControlObject( objectType, objectId){
	var self = this;

	self.name = configHelper.createControlObjectName( objectType, objectId);

	self.conf = configHelper.getConfByName( self.name);
	if( !self.conf)
		self.conf = configHelper.getDynamicConf( self.name);

	self.messageReceiver = new MessageExchanger( self.conf);
	self.messageSender = self.messageReceiver;
	self.messageSerializer = null;
	self.objectType = objectType;
	self.objectId = objectId;

	self.controlCacher = new ControlCacher();

	var attributeMap_ = {};
	var attributeAsyncGettersMap_ = {};

	var accessControlList_ = [];

	var isInit_ = false;

	self.isInit = function(){
		return isInit_;
	};

	self.destroy = function(){
		self.messageReceiver.stop();
	};

	self.init = function( callback){
		if( isInit_)
			return callbackHelper.callNextTick( callback, "ControlObject Already inited!", false);
		
		setInterval( function(){
		    if (global.gc){
	    		global.gc();
	    		//console.log( "global.gc");	
	    	    }
	        
		}, 30000);
		
		try{
			self.messageSerializer = new MessageSerializer();
		}
		catch( e){
			self.emit( 'error', "MessageSerializer create error:", e);
			callbackHelper.callNextTick( callback, "MessageSerializer create error!", false);
			return;
		}

		var receiveCallback = function( err, res){

			if( err) return 0;

			try{
				var message = self.messageSerializer.parseFromBuffer( res);
			}
			catch( e){
				self.emit( 'error', "Message parse error:", e);
				return 0;
			}

			self.emit( 'message', message, res);
			messageLogger.log( self.name, message, null, true);

			self.dispatch( message);

			return message.messageId;
		};

		var messageReceiverInitCallback = function( err, res){
			if( !err){
				self.controlCacher.init( function ( error) {
					if( error)
						console.log( "Init ControlCacher error:", error);
				});

				return self.initPresence( callback, err, res);
			}

			callbackHelper.callNextTick( callback, err, res);
		}

		self.messageReceiver.receive( messageReceiverInitCallback, receiveCallback);
	};

	self.initPresence = function( callback, err, res){
		var presenceConf = configHelper.getPresenceConf();
		if( presenceConf.enable != "yes")
			return callbackHelper.callNextTick( callback, err, res);

		self.sendPresenceHelloInterval = setInterval( function(){
            self.sendPresenceHello();
		}, presenceConf.hello*1000);

        self.sendPresenceHello();
        callbackHelper.callNextTick( callback, err, res);
	};

    self.sendPresenceHello = function(){
        var presenceConf = configHelper.getPresenceConf();
        if( presenceConf.enable != "yes")
            return;

        var presenceMessage = new Message( self.name);
        presenceMessage.createCall( configHelper.getSubjectName()).createPresence();
        var dest = configHelper.getSubject();
        self.messageSender.send( dest, self.messageSerializer.serializeFromObject( presenceMessage));
    };

    self.sendPresenceBye = function(){
        var presenceConf = configHelper.getPresenceConf();
        if( presenceConf.enable != "yes")
            return;

        clearInterval( self.sendPresenceHelloInterval);

        var presenceMessage = new Message( self.name);
        presenceMessage.createCall( configHelper.getSubjectName()).createPresence().setBye();
        var dest = configHelper.getSubject();
        self.messageSender.send( dest, self.messageSerializer.serializeFromObject( presenceMessage));
    };

	self.deleteEvent = function( event){
		self.removeAllListeners( event);
		delete self._events[event];
	};

	self.dispatch = function( message){
		if( message.call != null)
			self.dispatchCall( message.call, message.messageId, message.sender);

		if( message.result != null)
			self.dispatchResult( message.result);

		if( message.data != null)
			self.dispatchData( message.data);
	};

	self.dispatchCall = function( call, messageId, sender){
		var resultMessage = null;

		if ( call.acl != null){
			self.dispatchAccessControlList( call.acl);
			return;
		}

		if ( call.attribute != null){

			var attributeName = call.attribute.attributeName;

			if( !call.attribute.set && attributeAsyncGettersMap_.hasOwnProperty( attributeName)) {
				if( self.isAccessAllowed( call, sender)){
					var dest = configHelper.getConfByName( sender);
					if( !dest)
						dest = configHelper.getDynamicConf( sender);
					attributeAsyncGettersMap_[ attributeName]( messageId, attributeName, dest);
				}
				else{
					resultMessage = self.createAccessDeniedResult( messageId, call);
					var dest = configHelper.getConfByName( sender);
					if( !dest)
						dest = configHelper.getDynamicConf( sender);
					self.messageSender.send( dest, self.messageSerializer.serializeFromObject( resultMessage));
				}

				return;
			}

			if( attributeMap_.hasOwnProperty( attributeName)){

				if( call.attribute.set && !attributeMap_[ attributeName].readonly && self.isAccessAllowed( call, sender))
					attributeMap_[ attributeName].attributeValue = call.attribute.attributeValue.toString();

				resultMessage = self.isAccessAllowed( call, sender) ? self.createSuccessResult( messageId, call.attribute.attributeName) : self.createAccessDeniedResult( messageId, call);

				var eventName =  ATTRIBUTE_SET_PREFIX;
				if( !call.attribute.set)
					eventName =  ATTRIBUTE_GET_PREFIX;

				self.emit( eventName, call.attribute);
				eventName = eventName + "_" + attributeName;
				self.emit( eventName, call.attribute);

				// TODO: know purpose of this line
//				self.deleteEvent( eventName);
			}
			else {
				resultMessage = new Message( self.name);
				resultMessage.createResult( messageId).createError( self.name, errorHelper.errors.noAttribute.message + " (CO: " + self.name + " Attr: " + attributeName + ")", errorHelper.errors.noAttribute.id);
			}
		}

		if( call.notification != null){
			self.emit( 'notification', call.notification);
		}

		if( resultMessage != null){
			var dest = configHelper.getConfByName( sender);
			if( !dest)
				dest = configHelper.getDynamicConf( sender);
			self.messageSender.send( dest, self.messageSerializer.serializeFromObject( resultMessage));
		}
	};

	self.isAccessAllowed = function( call, sender){

		if( !accessControlList_.length)
			return true;

		for( var i in accessControlList_){
			if( accessControlList_[ i].object == sender && accessControlList_[ i].scriptId == call.attribute.scriptId)
				return true;
		}

		return false;

	};

	self.createSuccessResult = function( messageId, attributeName){
		var resultMessage = new Message( self.name);
		resultMessage.createResult( messageId)
		.createAttributeResult( self.name,
				self.objectId,
				attributeName,
				attributeMap_[ attributeName].attributeValue);

		return resultMessage;
	};

	self.createAccessDeniedResult = function( messageId, call){
		resultMessage = new Message( self.name);

		resultMessage.createResult( messageId).createError( self.name, errorHelper.errors.accessDenied.message, errorHelper.errors.accessDenied.id);
		return resultMessage;
	};

	self.dispatchAccessControlList = function( accessControlList){
		if( accessControlList.hasOwnProperty( "object") && accessControlList.hasOwnProperty( "scriptId") && accessControlList.hasOwnProperty( "add")){
			accessControlList.add ? self.addAccessControlList( accessControlList) : self.deleteAccessControlList( accessControlList);
		}
	};

	self.dispatchData = function( data){
		self.emit( 'data', data);
	};

	self.addAccessControlList = function( accessControlList){
		for( var i in accessControlList_){
			if( accessControlList_[ i].object == accessControlList.object && accessControlList_[ i].scriptId == accessControlList.scriptId)
				return;
		}

		accessControlList_.push( accessControlList);
	};

	self.deleteAccessControlList = function( accessControlList){
		for( var i in accessControlList_){
			if( accessControlList_[ i].object == accessControlList.object && accessControlList_[ i].scriptId == accessControlList.scriptId)
				accessControlList_.splice( i, 1);
		}
	};

	self.dispatchResult = function( result){
		var resultEvent = 'result_' + result.correlationId;

		self.emit( resultEvent, result);
		self.deleteEvent( resultEvent);

		if( result.accessResult != null){
			resultEvent = 'resultAccess_' + result.correlationId;
		}

		if( result.attributeResult != null){
			resultEvent = 'resultAttribute_' + result.correlationId;
			self.emit( 'resultAttribute_' + result.correlationId, result.attributeResult);
		}

		if( result.notificationSubscribeResult != null){
			resultEvent = 'resultNotificationSubscribe_' + result.correlationId;
			self.emit( 'resultNotificationSubscribe_' + result.correlationId, result.notificationSubscribeResult);
		}

		if( result.error != null){
			resultEvent = 'resultError_' + result.correlationId;
			self.emit( 'resultError_' + result.correlationId, result.error);
		}

		self.deleteEvent( resultEvent);
	};

	self.onAttributeSet = function( attributeName, callback){
		self.on( ATTRIBUTE_SET_PREFIX + "_" + attributeName, function( attribute){
			callback( attribute);
		});
	}

	self.onceAttributeSet = function( attributeName, callback){
		self.once( ATTRIBUTE_SET_PREFIX + "_" + attributeName, function( attribute){
			callback( attribute);
		});
	}

	self.hasAttribute = function( attributeName){
		if( attributeMap_.hasOwnProperty( attributeName))
			return true;
		return false;
	};

	self.setAttribute = function( attributeName, attributeValue){
		if( attributeMap_.hasOwnProperty( attributeName))
			attributeMap_[ attributeName].attributeValue = attributeValue;
	};

	self.getAttribute = function( attributeName){
		if( attributeMap_.hasOwnProperty( attributeName))
			return attributeMap_[ attributeName].attributeValue;
		else
			return null;
	}

	self.cacheAttribute = function( attributeName, attributeValue, callback){
		if( self.hasAttribute( attributeName)){
			self.setAttribute( attributeName, attributeValue);
			self.controlCacher.cacheAttribute( self.name, attributeName, attributeMap_[ attributeName].attributeValue, callback);
		}
		else
			callbackHelper.callNextTick( callback, null, null);
	};

	self.delCcachedAttribute = function( attributeName){
		if( self.hasAttribute( attributeName))
			self.controlCacher.delCachedAttribute( self.name, attributeName, callback);
	};

	self.addBoolAttribute = function( attributeName, attributeValue, readonly){
		if( attributeName == null)
			return;

		var attribute = new Attribute( BoolAttributeType, attributeName, attributeValue, readonly);
		attributeMap_[ attributeName] = attribute;
	};

	self.addStringAttribute = function( attributeName, attributeValue, readonly){
		if( attributeName == null)
			return;

		var attribute = new Attribute( StringAttributeType, attributeName, attributeValue, readonly);
		attributeMap_[ attributeName] = attribute;
	};

	self.addFunctionAttribute = function( attributeName, setCallback, getCallback){
		if( attributeName == null)
			return;

		var attribute = new FunctionAttribute( attributeName, setCallback, getCallback);
		attributeMap_[ attributeName] = attribute;
	};

	self.addAsyncGetter = function( attributeName, callback){
		if( callback && callback instanceof Function) {
			attributeAsyncGettersMap_[ attributeName] = function( messageId, attributeName, dest) {
				callback( function( value) {
					resultMessage = new Message( self.name);
					resultMessage.createResult( messageId)
					.createAttributeResult( self.name,
							self.objectId,
							attributeName,
							value);

					self.messageSender.send( dest, self.messageSerializer.serializeFromObject( resultMessage));
				});
			}
		}
	}
};