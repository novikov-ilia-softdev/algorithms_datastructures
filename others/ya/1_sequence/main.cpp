#include <iostream>

void getCurLength( int* arr, int size, int index, int& curLength){
	
    if( index >= size)
    	return;
    
    if( arr[ index] == 1){
    	curLength++;
    	getCurLength( arr, size, index + 1, curLength);
    }
}

int main(){
    int size;
    std::cin >> size;
    int* arr = new int[ size];
    for( int i = 0; i < size; i++){
    	int temp;
        std::cin >> temp;
        arr[ i] = temp;
    }
    
    int maxLength = 0;
    
    for( int i = 0; i < size; i++){
        if( arr[ i] == 1){
            int curLength = 1;
            getCurLength( arr, size, i + 1, curLength);
            if( curLength > maxLength)
            	maxLength = curLength;
            i += (curLength - 1);
            
        }
    }
    
    std::cout << maxLength << std::endl;
    
    delete[] arr;
}