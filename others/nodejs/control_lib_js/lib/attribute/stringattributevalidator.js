var StringAttributeValidator = module.exports = {};

StringAttributeValidator.validate = function( value){
	if( value == null)
		return false;
	
	if( typeof value == "string" || value.toString() == "[object String]")
		return true;
};