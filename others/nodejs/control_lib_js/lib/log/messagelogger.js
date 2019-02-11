var configHelper = require( '../config/confighelper');

module.exports = MessageLogger;

Date.prototype.getMonthName = function() {
	return Date.locale.month_names[this.getMonth()];
};

Date.prototype.getFullDay = function() {
	return ("0" + (this.getDate())).slice(-2);
};

Date.prototype.getFullHours = function() {
	return ("0" + (this.getHours())).slice(-2);
};

Date.prototype.getFullMinutes = function() {
	return ("0" + (this.getMinutes())).slice(-2);
};

Date.prototype.getFullSeconds = function() {
	return ("0" + (this.getSeconds())).slice(-2);
};

Date.prototype.getFullMilliseconds = function() {
	return ("00" + (this.getMilliseconds())).slice(-3);
};

Date.locale = {
	month_names: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

Date.prototype.toLogDate = function() {
	//2015-Sep-01 09:36:44.221406
	return this.getFullYear()+"-"+this.getMonthName()+"-"+this.getFullDay()+" "+this.getFullHours()+":"+this.getFullMinutes()+":"+this.getFullSeconds()+"."+this.getFullMilliseconds()+"000";
};

function MessageLogger(){
	var self = this;
	self.conf = configHelper.getLogConf();
}

MessageLogger.prototype.log = function( scriptId, msg, dest, isIncoming) {
	var self = this;

	if( self.conf == undefined || self.conf.enable != "yes")
		return;

	var logFile = self.conf.path + scriptId + ".log";
	var inOut = "OUT";
	if( isIncoming)
		inOut = "IN";
	var date = new Date();

    var src = configHelper.getAnyConfByName( msg.sender);
    if( !dest)
        dest = configHelper.getAnyConfByName( scriptId);

	var log = "[controllib "+ date.toLogDate();
	log += " msg "+inOut+" from path: "+src.path+" to path: "+dest.path+"]\n"
	log += "messageId: " + msg.messageId + " sender: " + msg.sender;

	if( msg.hasOwnProperty( 'call'))
		log += " call: " +JSON.stringify( msg.call) + "\n"
	if( msg.hasOwnProperty( 'result'))
		log += " result: " +JSON.stringify( msg.result) + "\n"
	if( msg.hasOwnProperty( 'data'))
		log += " data: " +JSON.stringify( msg.result) + "\n"

	var fs = require( "fs");
	if( !fs.existsSync( self.conf.path))
		fs.mkdirSync( self.conf.path);
	fs.appendFileSync( logFile, log);
};
