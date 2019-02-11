module.exports = {}

module.exports.fromHzToKHz = function(hz) {
	if( isNaN( parseInt( hz))) {
		return "--";
	}
	return (hz / 1000).toFixed(0);
}

module.exports.fromKHzToHz = function(kHz) {
	if( isNaN( parseInt( kHz))) {
		return "--";
	}
	return kHz * 1000;
}