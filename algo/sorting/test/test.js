var bubble = require( '../src/bubble')
var config = require( './config')
var utils = require( './utils/utils')

console.time("script");

for( var i = 0; i < config.experimentsCount; i++){
    var size = utils.randomInt( config.minSize, config.maxSize);
    var array = utils.createArray( size, config.minValue, config.maxValue);
    bubble.sort( array)
    utils.checkSortIsCorrect( array);
}

console.log( "All experiments comleted successfully!");
console.timeEnd("script");