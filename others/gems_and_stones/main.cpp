#include <set>
#include <iostream>

int main(){
    std::string gems;
    std::string stones;
    
    std::cin >> gems;
    std::cin >> stones;
    
    std::set<char> gemsSet;
    for( int i = 0; i < gems.length(); i++){
    	gemsSet.insert( gems[ i]);
    }
    
    int result = 0;
    
    for( int i = 0; i < stones.length(); i++){
    	auto iter = gemsSet.find( stones[ i]);
	if( iter != gemsSet.end())
	    result++;
    }
    
    std::cout << result << std::endl;
}