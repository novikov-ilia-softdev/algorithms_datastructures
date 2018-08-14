// Compiled with: g++ -Wall -std=c++11 1task.cpp
//TASK 1
// Given a non-empty string s and a list wordList containing a list of non-empty words, determine if s can be segmented into a space-separated sequence of one or more dictionary words. You may assume the dictionary does not contain duplicate words.
// For example, given
// s = "whatanicedaya",
// wordList = ["a", "what", "an", "nice", "day"].
//
//
// Return true because "whataniceday" can be segmented as "what a nice day".

#include <iostream>
#include <vector>

class Main{
public:
    typedef std::vector<std::string> stringVector;
    static bool isSegmented( const std::string& str, const stringVector& dictionary);
    
private:
    static stringVector _getCandidates( const std::string& str, const stringVector& dictionary);
};

bool Main::isSegmented( const std::string& str, const stringVector& dictionary)
{
    if( str == "")
	return true;
    
    stringVector candidates = _getCandidates( str, dictionary);
    if( candidates.size() == 0)
	return false;
    
    for( auto candidate : candidates) 
    {
	if( isSegmented( str.substr( candidate.length()), dictionary))
	    return true;
    }
    
    return false;
}

Main::stringVector Main::_getCandidates( const std::string& str, const stringVector& dictionary)
{
    stringVector candidates;
    for( auto candidate : dictionary) 
    {
	if( str.find( candidate) == 0)
	    candidates.push_back( candidate);
    }
    
    return candidates;
}

int main( int argc, char* argv[]){
    std::string segmentableStr = "whataniceday";
    std::string nonSegmentableStr = "whatabadday";
    Main::stringVector dictionary;
    dictionary.push_back( "a");
    dictionary.push_back( "what");
    dictionary.push_back( "an");
    dictionary.push_back( "nice");
    dictionary.push_back( "day");

    // prints 1, string "whataniceday" is segmentable in what a nice day
    std::cout << Main::isSegmented( segmentableStr, dictionary) << std::endl;
    
    // prints 0, string "whatabadday" is not segmentable
    std::cout << Main::isSegmented( nonSegmentableStr, dictionary) << std::endl; 
    
    return 0;
}