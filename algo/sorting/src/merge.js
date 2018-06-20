module.exports = {};

var utils = require( './utils/utils')
/*
split each element into partitions of size 1
recursively merge adjancent partitions
for i = leftPartIdx to rightPartIdx
if leftPartHeadValue <= rightPartHeadValue
    copy leftPartHeadValue
else: copy rightPartHeadValue
copy elements back to original array
*/

module.exports.sort = function(array){
    var partitions = []
    for( var i in array)
        partitions.push( [ array[ i]])

    var res = recursiveMerge( partitions)
    //console.log( 'WOW')
    //console.log( res)

    for( var i in array)
        array[ i] = res[ i]
}

function recursiveMerge( partitions){
    //console.log( 'recursiveMerge')
    //console.log( partitions)
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

    //console.log( 'left', left, 'right', right)

    leftIndex = 0, rightIndex = 0

    var result = []

    while( leftIndex < left.length && rightIndex < right.length){
        //console.log( 'leftIndex:', leftIndex)
        //console.log( 'rightIndex:', rightIndex)
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

    //console.log( result)
    //console.log()
    return result
}