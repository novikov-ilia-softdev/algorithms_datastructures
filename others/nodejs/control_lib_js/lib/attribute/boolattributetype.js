var BoolAttributeType = module.exports = {};

var validator = require( './boolattributevalidator');

BoolAttributeType.validate = function( value){
	return validator.validate( value);
};

BoolAttributeType.defaultValue = function(){
	return 0;
};

BoolAttributeType.cast = function( value){
	var val = 0;

	if( value === false || value === "false" || value === 0)
		val = 0;

	if( value === true || value === "true" || value > 0)
		val = 1;

	return val;
};