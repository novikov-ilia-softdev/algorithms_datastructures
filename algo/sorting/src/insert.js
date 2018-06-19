module.exports = {};

var utils = require( './utils/utils')

module.exports.sort = function(array){
    for( var i = 1; i < array.length; i++)
        for( var j = i; j > 0 && array[ j - 1] > array[ j]; j--)
            utils.swap( array, j - 1, j)
}