// GCD (Greatest common divisor)
// Or
// HCF (Highest common factor)

int getMin( int num, int* arr){
    int min = arr[ 0];
    for( int i = 1; i < num; i++){
        if( arr[i] < min)
            min = arr[ i];
    }
    
    return min;
}

int generalizedGCD(int num, int* arr)
{
    int cand = getMin( num, arr);
    
    while( cand > 1){
        bool found = true;
        for( int i = 0; i < num; i++){
            if( arr[ i] % cand > 0)
                found = false;
        }
        
        if( found){
            return cand;
        }
        
        cand--;
    }
    
    return 1;
}