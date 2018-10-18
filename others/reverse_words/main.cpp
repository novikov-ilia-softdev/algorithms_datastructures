#include <iostream>

void reverseWord( char* str, int left, int right){
    while( left < right){
        char temp = str[ left];
        str[ left] = str[ right];
        str[ right] = temp;
        left++;
        right--;
    }
}

void reverseWords( char* str){
    int cur = 0;
    int left = 0;
    int right = 0;
    while( str[cur]){
        if( str[cur] == ' '){
            right = cur - 1;
            reverseWord( str, left, right);
            left = cur + 1;
        }
        cur++;
    }
    reverseWord( str, left, cur - 1);
}

int main(){
    char str1[] = { 'I', ' ', 'l', 'o', 'v', 'e', ' ', 't', 'a', 'x', 'i', 'f', 'y', '\0' };
    std::cout << str1 << " -> ";
    reverseWords( str1);
    std::cout << str1 << std::endl;
}