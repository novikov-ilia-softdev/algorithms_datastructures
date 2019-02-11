module.exports = MultifonGateway;

function MultifonGateway( cityId, callEndpoint, operator, caller){
    var self = this;
    self._cityId = cityId;
    self._callEndpoint = callEndpoint;
    self._caller = caller;

    self.getCityId = function(){
        return self._cityId;
    }

    self.call = function( phoneNumber, callbacksObj)
    {
        self._caller.call( self._callEndpoint, null, phoneNumber, operator, callbacksObj);
    };
}
