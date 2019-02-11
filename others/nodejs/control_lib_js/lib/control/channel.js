var session = require('./session');
var controlObjectNameHelper = require('./controlobjectnamehelper');
var errorHelper = require('./errorhelper');

var channel = exports = module.exports = {};

channel.getSession = function() {
	return session;
};

channel.getControlObjectNameHelper = function() {
	return controlObjectNameHelper;
};

channel.getErrorHelper = function() {
	return errorHelper;
};