#include <iostream>
#include <set>

int main(){
    std::multiset<int> multiSet;
    
    int arrCount;
    std::cin >> arrCount;
    for( int i = 0; i < arrCount; i++){
        int arrSize;
        std::cin >> arrSize;
        for( int j = 0; j < arrSize; j++){
            int temp;
            std::cin >> temp;
            multiSet.insert( temp);
        }
    }
    
    for( auto it = multiSet.begin(); it != multiSet.end(); it++){
        std::cout << *it << " ";
    }
}