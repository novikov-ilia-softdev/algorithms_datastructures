var MessageReceiver = require( './messagereceiver');
var MessageSender = require( './messagesender');

module.exports = MessageExchanger;

function MessageExchanger( conf){
	var self = this;

	self.conf = conf;
	self.stopped = false;

	if( self.conf.transport == 'udp'){
        var dgram = require('unix-dgram');
        self.socket = dgram.createSocket('udp');
	}

    if( self.conf.transport == 'local'){
        var unix = require('unix-dgram');
        self.socket = unix.createSocket('unix_dgram');
    }

    self.conf.socket = self.socket;

    self.messageReceiver = new MessageReceiver( self.conf);
    self.messageSender = new MessageSender( self.conf);

	self.receive = function( callback, receiveCallback){
        if( self.stopped) return;
        self.messageReceiver.receive( receiveCallback);
        self.messageReceiver.init( callback);
	};

    self.send = function( dest, message, callback){
        if( self.stopped) return;
        self.messageSender.send( dest, message, callback);
    };

    self.stop = function(){
        self.stopped = true;
        self.socket.close();
        self.messageReceiver.stop();
    };
};