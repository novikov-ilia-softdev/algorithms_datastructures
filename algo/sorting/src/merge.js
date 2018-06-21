module.exports = {};

var utils = require( './utils/utils')

module.exports.sort = function( array){
    //console.time( 'split');
    var splitted = split( array)
    //console.timeEnd( 'split');

    //console.time( 'merge');
    var res = recursiveMerge( splitted)
    //console.timeEnd( 'merge');

    //console.time( 'final');
    return res
    //for( var i in array)
    //    array[ i] = res[ i]
    //console.timeEnd( 'final');
    //console.log()
}

function split( array){
    var splitted = []
    for( var i in array)
        splitted.push( [ array[ i]])

    return splitted
}

function recursiveMerge( partitions){
    if( partitions.length == 1)
        return partitions

    var newParts = []

    for( var i = 0; i < partitions.length; i += 2){
        newParts.push( merge( partitions[ i], partitions[ i + 1]))
    }

    return recursiveMerge( newParts)
}

function merge( left, right){
    if( !right)
        return left

    leftIndex = 0, rightIndex = 0

    var result = []

    while( leftIndex < left.length && rightIndex < right.length){
        if( left[ leftIndex] < right[ rightIndex]){
            result.push( left[ leftIndex])
            leftIndex++
        }
        else{
            result.push( right[ rightIndex])
            rightIndex++
        }
    }

    for( var i = leftIndex; i < left.length; i ++){
        result.push( left[ i])
    }

    for( var i = rightIndex; i < right.length; i ++){
        result.push( right[ i])
    }

    return result
}