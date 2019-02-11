var BoolAttributeValidator = module.exports = {};

function isInt(value) { 
    return !isNaN( parseInt( value, 10)) && ( parseFloat( value, 10) == parseInt( value, 10)); 
}

BoolAttributeValidator.validate = function( value){
	if (	value === true || value === false ||
			value === "true" || value === "false" ||
			isInt( value))
		return true;
	return false;
};
