module.exports = {};

module.exports.sort = function(array){
    for( var i = 0; i < array.length - 1; i++){
        for( var j = i + 1; j < array.length; j++){
            if( array[ i] > array[ j]){
                var temp = array[ i]
                array[ i] = array[ j];
                array[ j] = temp;
                //swap( array[i], array[j]);
            }
        }
    }
}

function swap( a, b){
    var temp = a;
    a = b;
    b = temp;
}