module.exports = {};

var utils = require( './utils/utils')

module.exports.sort = function(array){
    for( var i = 0; i < array.length - 1; i++){
        var minIndex = i;
        for( var j = i + 1; j < array.length; j++)
            if( array[ j] < array[ minIndex])
                minIndex = j;

        utils.swap( array, i, minIndex)
    }

    return array
}