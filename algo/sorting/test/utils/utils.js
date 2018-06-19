module.exports = {};

module.exports.createArray = function( size, minValue, maxValue){
    var array = []
    for( var i = 0; i < size; i++){
        array.push( module.exports.randomInt( minValue, maxValue))
    }
    return array
}

module.exports.checkSortIsCorrect = function( array){
    var example = [];
    for( var i in array)
        example.push( array[ i]);

    example = example.sort( compareNumbers);

    for( var i in array){
        if( array[ i] != example[ i]){
            console.log( "ERROR!");
            array.nonExist.test
        }
    }
}

module.exports.randomInt = function(low, high){
    return Math.floor(Math.random() * (high - low) + low);
}

function compareNumbers(a, b){
    return a - b;
}