module.exports = {};

var utils = require( './utils/utils')

module.exports.sort = function(array){
    for( var i = 0; i < array.length - 1; i++)
        for( var j = i + 1; j < array.length; j++)
            if( array[ i] > array[ j])
                utils.swap( array, i, j)

    return array
}