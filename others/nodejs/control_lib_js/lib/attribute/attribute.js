module.exports = Attribute;

function Attribute( attributeType, attributeName, attributeValue, readonly){
	var self = this;
	
	self.attributeName = attributeName;
	self.readonly = readonly == null ? false : readonly;
	
	self.attributeType = attributeType;
	
	var value;
	if ( attributeValue == null || !self.attributeType.validate( attributeValue)) 
		value = self.attributeType.defaultValue(); 
	else
		value = attributeValue;
	
	Object.defineProperty( self, "attributeValue", {
		get: function(){ 
			return self.attributeType.cast( value);
		},
		set: function( attributeValue){
			if( !readonly && self.attributeType.validate( attributeValue))
				value = self.attributeType.cast( attributeValue);
		}
	});
};