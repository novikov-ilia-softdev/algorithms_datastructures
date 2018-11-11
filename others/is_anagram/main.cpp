#include <iostream>
#include <map>

void fillFreq( std::map<char, int>& freq, const std::string& str){
	for( int i = 0; i < str.length(); i++){
    	auto it = freq.find( str[ i]);
        if( it == freq.end())
        	freq.insert( std::pair<char, int>( str[ i], 1));
          else
           	it->second++;
    }
}

int isAnagram( const std::string& a, const std::string& b){
    std::map<char, int> freqA;
    std::map<char, int> freqB;
    fillFreq( freqA, a);
    fillFreq( freqB, b);
    
    if( freqA.size() != freqB.size())
    	return 0;
        
    for( auto itA = freqA.begin(); itA != freqA.end(); itA++){
    	auto itB = freqB.find( itA->first);
        if( itB == freqB.end())
        	return 0;
            
        if( itA->second != itB->second)
        	return 0;
    }
    
    return 1;
}

int main(){
	std::string a;
    std::string b;
    std::cin >> a;
    std::cin >> b;
    std::cout << isAnagram(a, b) << std::endl;
}