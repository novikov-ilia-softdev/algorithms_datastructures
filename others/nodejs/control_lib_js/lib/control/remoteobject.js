var configHelper = require( '../config/confighelper');
var MessageSerializer = require( 'control_serialization_lib').MessageSerializer;
var Message = require( 'control_serialization_lib').Message;
var callbackHelper = require( '../utils/callbackhelper');

var MessageLogger = require( './../log/messagelogger');
var messageLogger = new MessageLogger();

module.exports = RemoteObject;

function RemoteObject( name, controlObject){
	var self = this;

	self.messageSender = controlObject.messageSender;
	self.controlObject = controlObject;
	self.controlCacher = controlObject.controlCacher;
	self.name = name;
	self.senderName = self.controlObject.name;
	self.scriptId = self.controlObject.objectId;
	self.messageSerializer = null;

	try{
		self.messageSerializer = new MessageSerializer();
	}
	catch( e){ self.createMessageSerializerError = e;}
};

RemoteObject.prototype.lock = function( callback){
	var msg = this.createAccessCallMessage( "lock");
	this.sendMessage( msg, callback);
};

RemoteObject.prototype.isLocked = function( callback){
	var msg = this.createAccessCallMessage( "isLocked");
	this.sendMessage( msg, callback);
};

RemoteObject.prototype.tryLock = function( callback){
	var msg = this.createAccessCallMessage( "tryLock");
	this.sendMessage( msg, callback);
};

RemoteObject.prototype.unlock = function( callback){
	var msg = this.createAccessCallMessage( "unlock");
	this.sendMessage( msg, callback);
};

RemoteObject.prototype.getAttr = function( attrName, callback) {
	var self = this;
	var msg = this.createAttributeCallMessage( attrName);

	if( this.controlCacher.isInit()){
		this.controlCacher.getCachedAttribute( self.name, attrName, function( err, res){
			if( err || res == undefined)
				self.sendMessage( msg, callback);
			else
				callbackHelper.callNextTick( callback, null, res);
		});
	}
	else
		this.sendMessage( msg, callback);
};

RemoteObject.prototype.setAttr = function( attrName, attrValue, callback, timeout) {
	var msg = this.createAttributeCallMessage( attrName, attrValue);
	this.sendMessage( msg, callback, timeout);
};

RemoteObject.prototype.sendData = function( header, data, callback, timeout) {
	var msg = this.createDataMessage( header, data);
	this.sendMessage( msg, callback, timeout);
};

RemoteObject.prototype.sendMessage = function( msg, callback, timeout) {
	var self = this;
	if( !timeout)
		timeout = 5000;

	if( callback && callback instanceof Function)
		callback = callback.bind( this);

	if( !this.messageSerializer)
		return callback( this.createMessageSerializerError);

	var resultEventId = 'result_' + msg.messageId;
	this.controlObject.once( resultEventId, function( res){
		if( timeoutCalled)
			return;
		clearTimeout( timeoutId);

		var err = null;
		var result = null;

		if( res.hasOwnProperty( 'accessResult')){
			if( res.accessResult.lock)
				result = res.accessResult.lock;

			if( res.accessResult.tryLock)
				result = res.accessResult.tryLock;

			if( res.accessResult.isLocked)
				result = res.accessResult.isLocked;

			if( res.accessResult.unlock)
				result = res.accessResult.unlock;
		}

		if( res.hasOwnProperty( 'attributeResult')){
			result = res.attributeResult.attributeValue.toString();
		}

		if( res.hasOwnProperty('error'))
			err = res.error;

		if( callback && callback instanceof Function){
			process.nextTick( function(){
				callback( err, result);
			});
		}
	});

	var message = this.messageSerializer.serializeFromObject( msg);

	if( msg.data){
		var dest = configHelper.getConfByName( self.name),
			sendCallback = callback;
	}
	else if( msg.call.attribute){
		var dest = configHelper.getConfByName( msg.call.remote),
			sendCallback = null;
	}
	else{
		var dest = configHelper.getSubject(),
			sendCallback = null;
	}

	var timeoutCalled = false;
	var timeoutId = setTimeout( function() {
		self.controlObject.removeAllListeners( resultEventId);
		timeoutCalled = true;
		if( callback instanceof Function) {
			callback( { "description": "Timeout error" } );
		}
	}, timeout);
	this.messageSender.send( dest, message, function(err, res) {
		if( sendCallback instanceof Function) {
			if( timeoutCalled)
				return;
			clearTimeout( timeoutId);
			sendCallback(err, res);
		}
	});
	messageLogger.log( self.controlObject.name, msg, dest, false);
};

RemoteObject.prototype.createAccessCallMessage = function( lockType){
	var message = new Message( this.senderName);
	message.createCall( configHelper.getSubjectName()).createAccess( this.name, this.scriptId, lockType);
	return message;
};

RemoteObject.prototype.createDataMessage = function( header, data){
	var message = new Message( this.senderName);
	message.createData( header, data);
	return message;
};

RemoteObject.prototype.createAttributeCallMessage = function( attrName, attrValue){
	var message = new Message( this.senderName);
	message.createCall( this.name).createAttribute( this.name, this.scriptId, attrName, attrValue);
	return message;
};