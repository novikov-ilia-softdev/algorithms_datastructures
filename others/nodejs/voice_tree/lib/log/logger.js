var fs = require( "fs");
var LOG_DIRECTORY = "/tmp/voice_tree/"
var LOG_FILE = LOG_DIRECTORY + "voice_tree.log";

module.exports = Logger;

function Logger(){
	var _self = this;
	_self.isInit = false;
	
	// +
	_self.init = function(){
		if( !fs.existsSync( LOG_DIRECTORY))
			fs.mkdirSync( LOG_DIRECTORY);
		
		fs.writeFileSync( LOG_FILE, "============= voice_tree.log ===============\n");
		_self.isInit = true;
	}
	
	// +
	_self.logMessage = function( message){
		if( !_self.isInit)
			return;
		
		var date = new Date();
		fs.appendFileSync( LOG_FILE, date + ": " + message + "\n");
	}
}