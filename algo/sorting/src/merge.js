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
    var partitions = [];

    for( var i in array){
        partitions.push( { startIndex: parseInt( i), endIndex: parseInt( i), size: 1, members: [ array[ i]]})
    }

    mergePartitions( partitions);
}

function mergePartitions( partitions){
    for( var j = 0; j < 2; j++){
        for( var i = 0; i < partitions.length - 1; i++){
            if( partitions[ i].size == partitions[ i + 1].size){
                var leftPart = partitions[ i];
                var rightPart = partitions[ i + 1];
                var mergedPart = mergeParts( leftPart, rightPart);
                partitions.splice( i + 1, 1);
                partitions[ i] = mergedPart;
            }
        }
    }
}

function mergeParts( leftPart, rightPart){
    var tempArray = [];

    for( var i = leftPart.startIndex; i < rightPart.endIndex; i++){

        if( leftPart.members.length == 0 || rightPart.members.length == 0)
            break;

        if( leftPart.members[ 0] < rightPart.members[ 0]){
            tempArray.push( leftPart.members[ 0]);
            leftPart.members.splice( 0, 1);
        }
        else{
            tempArray.push( rightPart.members[ 0]);
            rightPart.members.splice( 0, 1);
        }
    }

    if( leftPart.members.length != 0){
        tempArray.push( leftPart.members[ 0]);
        leftPart.members.splice( 0, 1);
    }

    if( rightPart.members.length != 0){
        tempArray.push( rightPart.members[ 0]);
        rightPart.members.splice( 0, 1);
    }

    var mergedPart = { startIndex: leftPart.startIndex,
        endIndex: rightPart.endIndex,
        size: tempArray.length,
        members: tempArray }

    return mergedPart;
}