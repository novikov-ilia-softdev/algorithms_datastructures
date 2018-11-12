#include <iostream>

void getDuplicates( int* arr, int size, int curValue, int curIndex, int& dupCount){
	
    if( curIndex >= size)
    	return;
    
    if( arr[ curIndex] == curValue){
        dupCount++;
    	getDuplicates( arr, size, curValue, curIndex + 1, dupCount);
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
        std::cout << arr[ i] << std::endl;
        int dupCount = 0;
        getDuplicates( arr, size, arr[i], i + 1, dupCount);
        i += dupCount;
    }
    
    delete[] arr;
}