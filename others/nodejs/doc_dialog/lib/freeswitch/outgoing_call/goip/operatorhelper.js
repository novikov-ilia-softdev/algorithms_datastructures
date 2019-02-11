module.exports = OperatorHelper;

function OperatorHelper( operators){
    var self = this;
    self._operators = operators;

    self.getOperator = function( phoneNumber)
    {
        var prefix = self._getPrefix( phoneNumber);
        for( var i in self._operators)
        {
            var operator = self._operators[ i];
            for( var j in operator.prefixes)
            {
                if( prefix == operator.prefixes[j])
                    return operator.name;
            }
        }

        return null;
    };

    self._getPrefix = function( phoneNumber)
    {
        //         0123456789..
        // mobile: +79xxxxxxxxx
        return phoneNumber.substr( 2, 3);
    };
}