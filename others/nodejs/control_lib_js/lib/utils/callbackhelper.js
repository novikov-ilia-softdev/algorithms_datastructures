var callbackHelper = exports = module.exports = {};

callbackHelper.call = function( callback, err, res){
	if( callback && callback instanceof Function)
		callback( err, res);
}

callbackHelper.callNextTick = function( callback, err, res){
	if( callback && callback instanceof Function){
		setImmediate( function(){
		//process.nextTick( function(){
			callback( err, res);
		});
	}
}

callbackHelper.isFunction = function( callback){
	if( callback && callback instanceof Function)
		return true;
	return false;
}
