var fs = require( 'fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Message = require( 'control_serialization_lib').Message;
var MessageSerializer = require( 'control_serialization_lib').MessageSerializer;

var MessageExchanger =  require( '../../lib/messageexchange/messageexchanger');
var configHelper = require( '../../lib/config/confighelper');
var errorHelper = require('../../lib/control/errorhelper');

module.exports = SubjectMock;

util.inherits( SubjectMock, EventEmitter);

function SubjectMock(){
	var self = this;

	self.messageReceiver = new MessageExchanger( configHelper.getSubject());
	self.messageSender = self.messageReceiver;
	self.messageSerializer = null;
	self.presenceHelloCount = 0;

	self.noAttributeErrorCOs = {};

	var isInit_ = false;

	self.isInit = function(){
		return isInit_;
	};

    self.receiveCallback = function( err, res){
		
		if ( err != null) return 0;

		var message = self.messageSerializer.parseFromBuffer( res);

		var resultMessage = null;

		if( message.call != null)
		{
			if( message.call.access != null){
				resultMessage = new Message( configHelper.getSubjectName());
				resultMessage.createResult( message.messageId)
							 .createAccessResult( message.call.access.accessableObject, 
												  message.call.access.scriptId,
												  true);
			}
			
			if( message.call.attribute != null){
				var attributeValue = "1";
				if( message.call.attribute.set)
					attributeValue = message.call.attribute.attributeValue;
					
				resultMessage = new Message( configHelper.getSubjectName());
				if( self.noAttributeErrorCOs.hasOwnProperty( message.call.attribute.ownerObject)){
					resultMessage.createResult( message.messageId)
						.createError( message.call.attribute.ownerObject,
									  errorHelper.errors.noAttribute.message,
									  errorHelper.errors.noAttribute.id);
				}else{
					resultMessage.createResult( message.messageId)
						.createAttributeResult( message.call.attribute.ownerObject,
												message.call.attribute.scriptId,
												message.call.attribute.attributeName,
												attributeValue);
				}
				
			}
			
			if( message.call.event != null){
				self.emit( 'event', message.call.event);
				return message.messageId;
			}
			
			if( message.call.subscribe != null){
				if( message.call.subscribe.del){
					self.emit( 'unsubscribe', message.call.subscribe);
				}
				else{
					self.emit( 'subscribe', message.call.subscribe);

					resultMessage = new Message( configHelper.getSubjectName());
					resultMessage.createResult( message.messageId).createNotificationSubscribeResult( true);
				}
			}

			if( message.call.presence){
				var presence = message.call.presence;
				if( presence.hello){
					self.presenceHelloCount +=1;
					self.emit( 'presenceHello', self.presenceHelloCount);
				}
				if( presence.bye)
					self.emit( 'presenceBye', presence);

				return;
			}
		}
		
		if( message.result != null){
			if( message.result.error != null){
				self.emit( 'resultError', message.result.error);
			}

			if( message.result.attributeResult != null){
				self.emit( 'result_' + message.result.correlationId, message.result.attributeResult);
			}
		}
		
		if( resultMessage){
			var dest = configHelper.getConfByName( message.sender);
			if( !dest)
				dest = configHelper.getDynamicConf( message.sender);
			self.sendMessage( dest, resultMessage);
		}

		return message.messageId;
	};

	self.start = function( callback){
        var self = this;
		if( isInit_){
			if( callback != null)
				callback( "SubjectMock Already inited!");
			return;
		}

		self.messageReceiver.receive( function( err, res){
			if ( err == null){
				try{
					self.messageSerializer = new MessageSerializer();
				}
				catch( e){
					return callback( e);
				}

				try{
					self.presenceSerializer = new MessageSerializer( "presence.desc", "message.Presence");
				}
				catch( e){
					return callback( e);
				}
				isInit_ = true;
			}
			
			if( callback != null)
				callback( err, res);
		}, self.receiveCallback);
	};
	
	self.stop = function(){
		self.messageReceiver.stop();
	};

	self.sendNotification = function( controlObjectName, dest){
		var senderName = "test"
		var date = new Date();
		
		var innerMessage  = new Message( senderName);
		innerMessage.createCall( senderName)['scriptChangeStatus'] = {
			'scriptId': 123421,
			'oldStatus': {'started':true},
			'newStatus': {'started':true}
		};

		var message = new Message( senderName);
		message.createCall( senderName).createNotification( date.toString(), self.messageSerializer.serializeFromObject( innerMessage));

		self.sendMessage( dest, message);
	};
	
	self.sendMessage = function( dest, message){

		var serializedMessage = self.messageSerializer.serializeFromObject( message);
		
		self.messageSender.send( dest, serializedMessage, function( err, res){
			var receivedMessageId = res;
			if( err)
				self.emit( 'sendError', err);
			else
				self.emit( 'sendedAndReceivedMessageIds', message.messageId, receivedMessageId);
		});
	};
	
	self.getAttribute = function( controlObjectName, scriptId, attributeName, dest, callback){
		var message = new Message( configHelper.getSubjectName());
		message.createCall( controlObjectName).createAttribute( controlObjectName, scriptId, attributeName);
		
		self.on( 'result_' + message.messageId, callback);
		
		var serializedMessage = self.messageSerializer.serializeFromObject( message);
		self.messageSender.send( dest, serializedMessage);
	};

	self.setAttribute = function( controlObjectName, scriptId, attributeName, attributeValue, dest, callback){
		var message = new Message( configHelper.getSubjectName());
		message.createCall( controlObjectName).createAttribute( controlObjectName, scriptId, attributeName, attributeValue);
		
		self.on( 'result_' + message.messageId, callback);
		
		var serializedMessage = self.messageSerializer.serializeFromObject( message);
		self.messageSender.send( dest, serializedMessage);
	};
	
	self.addNoAttributeErrorCO = function( controlObjectName){
		self.noAttributeErrorCOs[controlObjectName] = controlObjectName;
	}
};
