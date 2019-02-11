module.exports = CallQuery;

function CallQuery( phoneNumber, callbacks){
    var self = this;
    self._phoneNumber = phoneNumber;
    self._callbacks = callbacks;

    self.getPhoneNumber = function()
    {
        return self._phoneNumber;
    };

    self.getCallbacks = function()
    {
        return self._callbacks;
    };
}