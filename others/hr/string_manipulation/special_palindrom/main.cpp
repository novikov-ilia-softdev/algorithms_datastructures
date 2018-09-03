#include <bits/stdc++.h>

using namespace std;

bool isSpecialPalindrom( const std::string& s){
    //cout << "isSpecialPalindrom: " << s << ", ";
    
    if( s.length() == 1){
        //cout << "true" << endl;
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
            return false;
        }
            
    }
    
    //cout << "true" << endl;
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
