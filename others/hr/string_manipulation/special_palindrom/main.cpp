#include <bits/stdc++.h>

using namespace std;

void print( const map<string, bool> m){
    cout << "cache" << endl;
    for( auto it = m.begin(); it != m.end(); it++){
        cout << it->first << ": " << it->second << endl;
    }
    
}

bool isSpecialPalindrom( const std::string& s){
    //cout << "isSpecialPalindrom: " << s << ", ";
    static map<string, bool> isStrSpecPalindromMap;
    
    auto it = isStrSpecPalindromMap.find( s);
    if( it != isStrSpecPalindromMap.end()){
        //cout << "from cache " << it->second << endl;
        return it->second;
    }
        
    if( s.length() == 1){
        //cout << "true" << endl;
        isStrSpecPalindromMap.insert( pair<string,bool>(s, true));
        //print( isStrSpecPalindromMap);
        return true;
    }
        
    bool isLengthEven = s.length() % 2 == 0;
    int medIndex = isLengthEven ? -1 : s.length() / 2;
    
    char firstCh = s[0];
    for(int i = 1; i < s.length(); i++){
        if( i == medIndex)
            continue;

        if( s[i] != firstCh){
            //cout << "false" << endl;
            isStrSpecPalindromMap.insert( pair<string,bool>(s, false));
            //print( isStrSpecPalindromMap);
            return false;
        }
            
    }
    
    //cout << "true" << endl;
    isStrSpecPalindromMap.insert( pair<string,bool>(s, true));
    //print( isStrSpecPalindromMap);
    return true;
}

void recursiveCount( const std::string& s, long& res){
    //cout << endl << "recursiveCount: " << s << endl;
    
    if( s == "")
        return;
    
    for(int i = 1; i <= s.length(); i++){
        if( isSpecialPalindrom( s.substr(0, i)))
            res++;
    }
    
    recursiveCount( s.substr( 1), res);
}

long substrCount(int n, string s) {
    long res = 0;
    recursiveCount( s, res);
    return res;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    string s;
    getline(cin, s);

    long result = substrCount(n, s);

    fout << result << "\n";

    fout.close();

    return 0;
}
