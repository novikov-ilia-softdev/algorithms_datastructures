module.exports = {};

var utils = require( './utils/utils')

module.exports.sort = function( arr){
    //console.log( 'sort', arr)
    if (arr.length === 1) {
        // return once we hit an array with a single item
        //console.log( 'sort result:', arr, '\n')
        return arr
    }

    const middle = Math.floor(arr.length / 2) // get the middle item of the array rounded down
    const left = arr.slice(0, middle) // items on the left side
    const right = arr.slice(middle) // items on the right side

    return merge(
        module.exports.sort(left),
        module.exports.sort(right)
    )

    //console.lo



    //for( var i in arr)
    //    arr[ i] = res[ i]

    //return res
}

function merge (left, right) {
    //console.log( 'merge left:', left, ' right:', right)
    //if( !right){
    //    console.log( 'merge result:', left, '\n')
    //    return left
    //}

    let result = []
    let indexLeft = 0
    let indexRight = 0

    while (indexLeft < left.length && indexRight < right.length) {
        if (left[indexLeft] < right[indexRight]) {
            result.push(left[indexLeft])
            indexLeft++
        } else {
            result.push(right[indexRight])
            indexRight++
        }
    }

    //console.log( 'indexLeft:', indexLeft, 'indexRight:', indexRight)
    //console.log( 'left.slice(indexLeft):', left.slice(indexLeft), 'right.slice(indexRight):', right.slice(indexRight))

    //result =
    //console.log( 'merge result:', result, '\n')

    return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight))
}

