module.exports = {};

var utils = require( './utils/utils')

module.exports.sort = sort

function sort( array){
    if( array.length === 1)
        return array

    const middle = Math.floor( array.length / 2)
    const left = array.slice( 0, middle)
    const right = array.slice( middle)

    return merge( sort(left), sort(right))
}

function merge( left, right) {
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

