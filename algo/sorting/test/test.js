var bubble = require( '../src/bubble')
var config = require( './config')

console.time("script");

for( var i = 0; i < config.experimentsCount; i++){
  var size = randomInt( config.minSize, config.maxSize);
  var array = createArray( size);
  //console.log( array)
  bubble.sort( array)
  //console.log( array)
  checkSortIsCorrect( array);
}

console.log( "All experiments comleted successfully!");
console.timeEnd("script");

// Helpers

function createArray( size){
    var array = []
    for( var i = 0; i < size; i++){
      array.push( randomInt( config.minValue, config.maxValue))
    }
    return array
}

function checkSortIsCorrect(){
    var example = [];
    for( var i in array){
	example.push( array[ i]);
    }
    
    example = example.sort( compareNumbers);
    
    for( var i in array){
        if( array[ i] != example[ i]){
            console.log( "ERROR!");
            array.nonExist.test
        }
    }
}

function randomInt (low, high){
    return Math.floor(Math.random() * (high - low) + low);
}

function compareNumbers(a, b){
    return a - b;
}