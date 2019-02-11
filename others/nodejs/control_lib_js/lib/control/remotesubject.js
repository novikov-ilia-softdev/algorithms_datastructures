var configHelper = require( '../config/confighelper');
var MessageSerializer = require( 'control_serialization_lib').MessageSerializer;
var Message = require( 'control_serialization_lib').Message;

var MessageLogger = require( './../log/messagelogger');
var config = require( "../../config.json");

var messageLogger = new MessageLogger( config);

module.exports = RemoteSubject;

function RemoteSubject( session, controlObject){
	var self = this;
	self.subscribed = false;
	self.session = session;
	self.conf = configHelper.getSubject();
    self.messageSender = controlObject.messageSender;
	self.messageSerializer = null;

	try{
		self.messageSerializer = new MessageSerializer();
	}
	catch( e){ self.messageSerializerCreateError = e;}
};

RemoteSubject.prototype.send = function( message, callback){
	var serializedMessage = this.messageSerializer.serializeFromObject( message);
	this.messageSender.send( configHelper.getSubject(), serializedMessage, callback);
	messageLogger.log( message.sender, message, configHelper.getSubject(), false);
};

RemoteSubject.prototype.notify = function( controlObjectName, eventId, data, callback){
	var message = new Message( controlObjectName);
	message.createCall( configHelper.getSubjectName()).createEvent( controlObjectName, eventId, data);

	if( !this.messageSerializer){
		process.nextTick( function(){
			callback( this.messageSerializerCreateError);
		});
		return;
	}

	this.send( message, callback);
};

// callback function( err, subscribeResult, notification){}
RemoteSubject.prototype.subscribe = function( controlObjectName, eventList, callback){	
	var self = this;

	function notificationHandler( notification){
		process.nextTick( function(){
				callback( null, null, notification);
		});
	};
	
	var controlObject = self.session.getControlObject( controlObjectName);
	if( !controlObject){
		process.nextTick( function(){
			callback( "This Control Object not created!");
		});
		return;
	}
	
//	if( self.subscribed){
//		controlObject.on( 'notification', notificationHandler);
//		callback( null, { result: true}, null);
//		return;
//	}
	
	if( callback && callback instanceof Function)
		callback = callback.bind( self);

	var message = new Message( controlObjectName);
	message.createCall( controlObjectName).createNotificationSubscribe( controlObjectName, false, eventList);

	if( !this.messageSerializer){
		process.nextTick( function(){
			callback( self.messageSerializerCreateError);
		});
		return;
	}

   	controlObject.once( 'resultNotificationSubscribe_' + message.messageId, function( subscribeResult){
   		if( subscribeResult.result){
			process.nextTick( function(){
				callback( null, subscribeResult, null);
			});
   			controlObject.on( 'notification', notificationHandler);
   			return;
   		}
		process.nextTick( function(){
			callback( "Notification subscribe rejected!", subscribeResult);
		});
   	});

	self.subscribed = true;
	this.send( message);
};

// callback function( err, subscribeResult){}
RemoteSubject.prototype.unsubscribe = function( controlObjectName, callback){
	
	if( callback && callback instanceof Function)
		callback = callback.bind( this);

	var message = new Message( controlObjectName);
	message.createCall( controlObjectName).createNotificationSubscribe( controlObjectName, true);
	
	if( !this.messageSerializer) return callback( this.messageSerializerCreateError);
	
	var controlObject = this.session.getControlObject( controlObjectName);
   	if( !controlObject){
		process.nextTick( function(){
			callback( "This Control Object not created!");
		});
   		return;
   	}
	
	controlObject.once( 'resultNotificationSubscribe_' + message.messageId, function( subscribeResult){
   		if( subscribeResult.result){
			process.nextTick( function(){
				callback( null, subscribeResult);
			});
   			return;
   		}
		process.nextTick( function(){
			callback( "Notification unsubscribe rejected!", subscribeResult);
		});
   	});


   	var controlObject = this.session.getControlObject( controlObjectName);
   	if( controlObject == null){
		process.nextTick( function(){
	   		callback( "This Control Object not created!");
		});
   		return;
	}
   	
   	controlObject.removeAllListeners( "notification");

	this.send( message);
};

RemoteSubject.prototype.handleMessage = function( message){
	this.messageSender.send( configHelper.getSubject(), message);
};