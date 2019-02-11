var unix = require('unix-dgram');
var callbackHelper = require( '../utils/callbackhelper');
var fs = require('fs');

module.exports = MessageReceiver;

function MessageReceiver( conf){
	var self = this;

	self.conf = conf;
	self.upd = false;
    self.socket = conf.socket;

	if( conf.transport == 'udp'){
		self.upd = true;
		self.address = conf.address;
		self.port = conf.port;
	}

	self.receiveCallback = null;
	var isInit_ = false;

	self.stop = function(){
		if( fs.existsSync( self.conf.path))
			fs.unlinkSync( self.conf.path);
	};

	self.isInit = function(){
		return isInit_;
	};

	self.reinit = function( conf, callback){

		self.conf = conf;
		if( conf.transport == 'udp'){
			self.upd = true;
			self.address = address;
			self.port = port;
		}
		self.init( callback);
	};
	
	self.init = function( callback){
		
		if( isInit_)
			return callbackHelper.callNextTick( callback, "MessageReceiver Already inited!", false);

		if( self.conf.transport == 'udp'){
			try{
				self.socket.bind( self.port, self.address, function(){
					isInit_ = true;

					self.socket.on( "message", function (msg, rinfo) {
						if( self.receiveCallback != undefined)
							self.receiveCallback( null, msg, rinfo);
					});

					callbackHelper.callNextTick( callback, null, true);
				});
			}
			catch( ex){
				isInit_ = false;
				callbackHelper.callNextTick( callback, "socket bind error", false);
			}
		}
		else{
			try{
                self.socket.on( 'message', function (data) {
                    if( self.receiveCallback != undefined)
						self.receiveCallback( null, data);
                });

                self.socket.on('error', function (e) {
                    if (e.code == 'EADDRINUSE') {
                        isInit_ = false;
                        self.server = null;
                        callbackHelper.callNextTick( callback, "Server listen error EADDRINUSE", false);
                        return;
                    }
                    callbackHelper.call( callback, e, false);
                });

				if( fs.existsSync( self.conf.path))
					fs.unlinkSync( self.conf.path);

				self.socket.bind( self.conf.path);
				isInit_ = true;
				callbackHelper.callNextTick( callback, null);
			}
			catch( ex){
				callbackHelper.callNextTick( callback, ex, false);
			}
		}
	};
};

MessageReceiver.prototype.receive = function( callback){
	if( callback && callback instanceof Function)
		this.receiveCallback = callback;
};