console.time("script");

for( var i = 0; i < 1000000; i++){
  var SIZE = randomInt( 10, 20);
  var array = []
  createArray();
  //console.log( array);
  //bubbleSort();
  //selectSort();
  insertSort();
  //console.log( array);
  //console.log( "\n");
  checkSortIsCorrect();
}

console.log( "All experiments comleted successfully!");
console.timeEnd("script");

// Helpers

function createArray(){
    for( var i = 0; i < SIZE; i++){
      array.push( randomInt( 0, 100))
    }
}

function bubbleSort(){
    for( var i = 0; i < SIZE - 1; i++){
      for( var j = i + 1; j < SIZE; j++){
	if( array[ i] > array[ j]){
	    swap( i, j);
	}
      }
    }
}

function selectSort(){
    for( var i = 0; i < SIZE - 1; i++){
	var minIndex = i;
	for( var j = i + 1; j < SIZE; j++){
	    if( array[ j] < array[ minIndex]){
		minIndex = j;
	    }
	}
	
	swap( i, minIndex);
    }
}

function insertSort(){
    for( var i = 1; i < SIZE; i++){
	for( var j = i; j > 0; j--){
	    if( array[ j - 1] > array[ j])
	      swap( j - 1, j)
	    else
	      break;
	}
    }
}

function swap( a, b){
    var temp = array[ a];
    array[ a] = array[ b];
    array[ b] = temp;
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