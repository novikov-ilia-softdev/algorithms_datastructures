var callbackHelper = require( '../utils/callbackhelper');

module.exports = MessageSender;

function MessageSender( conf){
	var self = this;
	self.conf = conf;
	self.upd = false;
    self.socket = conf.socket;

	if( conf.transport == 'udp')
		self.upd = true;

	self.send = function( destination, message, callback) {
		if( self.udp)
			self.sendUdp( destination.address, destination.port, message, callback);
		else
			self.sendUDS( destination.path, message, callback);
	}

	self.sendUdp = function( address, port, message, callback) {

		var binaryMessage = new Buffer( message);
		this.socket.send( binaryMessage, 0, binaryMessage.length, port, address, function( err, bytes) {
			callbackHelper.call( callback, err, bytes);
		});
	};

	self.sendUDS = function( path, message, callback) {
		var self = this;

		var binaryMessage = new Buffer( message);

		try{
            self.socket.send( binaryMessage, 0, binaryMessage.length, path, function() {
				callbackHelper.call( callback, null, true);
			});
		}
		catch( ex){
//            callbackHelper.callNextTick( callback, "Send error!");
            //TODO actualy message was send but exeption was thrown
            callbackHelper.callNextTick( callback, null, true);
		}
	};
}