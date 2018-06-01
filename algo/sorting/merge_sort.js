console.time("script");

//for( var i = 0; i < 1000000; i++){
  var SIZE = randomInt( 10, 20);
  var array = [];
  var partitions = [];
  createArray();
  //console.log( array);
  //bubbleSort();
  //selectSort();
  //insertSort();
  mergeSort();
  //console.log( array);
  //console.log( "\n");
  //checkSortIsCorrect();
//}

//console.log( "All experiments comleted successfully!");
//console.timeEnd("script");

// Helpers

function createArray(){
    for( var i = 0; i < SIZE; i++){
      array.push( randomInt( 0, 100))
    }
}

function mergeSort(){
    for( var i in array){
        partitions.push( { startIndex: parseInt( i), endIndex: parseInt( i), size: 1, members: [ array[ i]]})
    }
    
    mergePartitions();
}

function mergePartitions(){
    
    //console.log( "before");
    //console.log( partitions);
    
    //while( partitions.length != 1){
    
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
        
        //console.log( "\nafter");
        //console.log( partitions);
        
    }
    //}
}

function mergeParts( leftPart, rightPart){
    var tempArray = [];
    
    console.log( "leftPart");
    console.log( leftPart);
    console.log( "rightPart");
    console.log( rightPart);
    
    for( var i = leftPart.startIndex; i < rightPart.endIndex; i++){
        
        //console.log( "leftPart.members.length");
        //console.log( leftPart.members.length);
        
        //console.log( "rightPart.members.length");
        //console.log( rightPart.members.length);
        
        if( leftPart.members.length == 0 || rightPart.members.length == 0)
            break;
        
        if( leftPart.members[ 0] < rightPart.members[ 0]){
             tempArray.push( leftPart.members[ 0]);
             leftPart.members.splice( 0, 1);
             //console.log( "leftPart after del");
             //console.log( leftPart);
        }
        else{
            tempArray.push( rightPart.members[ 0]);
            rightPart.members.splice( 0, 1);
            //console.log( "rightPart after del");
            //console.log( rightPart);
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
                      
    console.log( "mergedPart");
    console.log( mergedPart);
    console.log( "\n\n");
                       
    return mergedPart;
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