#include <iostream>
#include <cstring>
    
void swap( char* x, char* y){
    char temp = *x;
    *x = *y;
    *y = temp;
}
    
void permute( char* s, int start, int end){
    if( start == end){
        std::cout << s << std::endl;
    }
    else{
        for(int i = start; i <= end; i++){
            swap( s + start, s + i);
            permute( s, start + 1, end);
            swap( s + start, s + i);
        }
    }
}
    
int main(){
    char str[] = "ABC";
    permute( str, 0, strlen(str) - 1);
}