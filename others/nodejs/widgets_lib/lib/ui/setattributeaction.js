module.exports = SetAttributeAction;

var sharedObjectProvider = require( "../util/sharedobjectprovider");

var terminal_utils = require( 'terminal_utils');

function SetAttributeAction( widget, remoteObject, attributeName, value, setCallback, closable){
	var self = this;
	
	self.remoteObject = remoteObject;
	self.attributeName = attributeName;
	self.value = value;
	self.setCallback = setCallback;
    self.widget = widget;
    self.closable = closable;
	
	self.execute = function(){
		sharedObjectProvider.attributeHelper.setAttr( self.remoteObject, self.attributeName, self.value, function( err, res){
            if( self.closable)
                self.widget.close( function(){
                	if( terminal_utils.isFunction( setCallback))
                		self.setCallback( err, res);
                });
            else{
            	if( terminal_utils.isFunction( setCallback))
            		self.setCallback( err, res);
            }
        });
	};
}