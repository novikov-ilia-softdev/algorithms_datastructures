var config = require( './config')
var utils = require( './utils/utils')

var PATH_PREFIX = '../src/'
var timeStamp = 'time'

var sorters = [ 'bubble', 'select', 'insert', 'merge', 'merge_example']

for( var i in sorters){
    var sorter = require( PATH_PREFIX + sorters[ i])
    console.log( sorters[ i] + ' sorting of ' + config.experimentsCount + ' arrays...')
    console.time( timeStamp);
    for( var i = 0; i < config.experimentsCount; i++){
        var size = utils.randomInt( config.minSize, config.maxSize);
        var array = utils.createArray( size, config.minValue, config.maxValue);
        //var array = [ 3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48 ]
        var sortedArray = sorter.sort( array)
        utils.checkSortIsCorrect( sortedArray);
    }
    console.log( 'OK');
    console.timeEnd( timeStamp);
    console.log();
}