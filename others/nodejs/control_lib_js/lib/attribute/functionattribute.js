module.exports = FunctionAttribute;

function FunctionAttribute( attributeName, setCallback, getCallback){
	var self = this;
	
	self.attributeName = attributeName;

	if( setCallback && setCallback instanceof Function)
		self.setCallback = setCallback;
	else
		self.setCallback = function(){ return null;};

	if( getCallback && getCallback instanceof Function)
		self.getCallback = getCallback;
	else
		self.getCallback = function( attributeValue){};
	
	Object.defineProperty( self, "attributeValue", {
		get: function(){
			var value = self.getCallback();

			if( value instanceof Object){
				try{
					value = JSON.stringify( value);
				}
				catch( e) {}
			}
			return value;
		},
		set: function( attributeValue){
			try{
				attributeValue = JSON.parse( attributeValue);
			}
			catch( e) {}
			self.setCallback( attributeValue);
		}
	});
}