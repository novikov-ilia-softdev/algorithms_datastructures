#include <bits/stdc++.h>

using namespace std;

string isValid(string s) {
    map<char,int> charFreqMap;
    for(int i = 0; i < s.size(); i++){
        auto cfIt = charFreqMap.find( s[i]);
        if( cfIt == charFreqMap.end())
            charFreqMap.insert( pair<char,int>(s[i], 1));
        else
            cfIt->second++;
    }

    map<int,int> freqCountMap;
    for(auto cfIt = charFreqMap.begin(); cfIt != charFreqMap.end(); cfIt++){
        auto fcIt = freqCountMap.find( cfIt->second);
        if( fcIt == freqCountMap.end())
            freqCountMap.insert( pair<int,int>(cfIt->second, 1));
        else
            fcIt->second++;
    }
    
    if(freqCountMap.size() == 1 )
        return "YES";
    
    if(freqCountMap.size() == 2){
        if( freqCountMap.begin()->first == 1 && freqCountMap.begin()->second == 1 )
            return "YES";
            
        if( freqCountMap.rbegin()->second == 1 && 
            freqCountMap.rbegin()->first - 1 == freqCountMap.begin()->first)
            return "YES"; 
    }

    return "NO";
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string s;
    getline(cin, s);

    string result = isValid(s);

    fout << result << "\n";

    fout.close();

    return 0;
}
