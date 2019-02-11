var generator = require('idgenerator');

var id = exports = module.exports = {};

id.generate = function(){
	return generator.generate();
};