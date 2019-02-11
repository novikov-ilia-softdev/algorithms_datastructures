StringAttributeType = module.exports = {};

var validator = require( './stringattributevalidator');

StringAttributeType.validate = function( value){
	return validator.validate( value);
}

StringAttributeType.defaultValue = function(){
	return "";
};

StringAttributeType.cast = function( value){
	return value + "";
};