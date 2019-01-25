const int SIZE = 8;

int fillCell( int index, int* states){
    int prev = 0;
    int next = 0;
    if(index > 0)
        prev = states[ index - 1];
    if(index < SIZE - 1)
        next = states[ index + 1];
        
    if( (prev == 0 && next == 0) || (prev == 1 && next == 1))
        return 0;
        
    return 1;
}

void compete( int* states){
    int newStates[ SIZE];
    for( int i = 0; i < SIZE; i++){
        newStates[ i ] = fillCell( i, states);
    }
    
    for( int i = 0; i < SIZE; i++){
        states[ i ] = newStates[ i];
    }
}

vector<int> cellCompete(int* states, int days) 
{
    for( int i = 0; i < days; i++){
        compete( states);
    }
    
    vector<int> res;
    for( int i = 0; i < SIZE; i++){
        res.push_back( states[ i]);
    }
    
    return res;
}

// 10000100 => 01001010