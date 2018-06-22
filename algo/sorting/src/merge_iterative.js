module.exports = {};

var utils = require( './utils/utils')

module.exports.sort = function( array){
    var splitted = split( array)
    return mergeIterative( splitted)
}

function split( array){
    var splitted = []
    for( var i in array)
        splitted.push( [ array[ i]])

    return splitted
}

function mergeIterative( array){
    var res = array
    var temp = array

    while( res.length != 1){
        var temp = []
        for( var i = 0; i < res.length; i += 2){
            temp.push( merge( res[ i], res[ i + 1]))
        }
        res = temp
    }

    return res
}

function merge( left, right){
    if( !right)
        return left

    var result = []
    var indexLeft = 0
    var indexRight = 0

    while( indexLeft < left.length && indexRight < right.length) {
        if (left[indexLeft] < right[indexRight]) {
            result.push(left[indexLeft])
            indexLeft++
        }
        else {
            result.push(right[indexRight])
            indexRight++
        }
    }

    return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
}