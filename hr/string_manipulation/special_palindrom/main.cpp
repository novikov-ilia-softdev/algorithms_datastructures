#include <bits/stdc++.h>

using namespace std;

long substrCount(int n, string s) {
    long res = 0;
    
    for( int i = 0; i < s.length(); i++){
        res++;
            
        if( i == s.length() - 1)
            continue;
        
        char ch = s[i + 1];
        
        // odd
        int leftInd = i;
        int rightInd = i;
        while( --leftInd != -1 && ++rightInd != s.length() &&
               s[leftInd] == ch && s[rightInd] == ch){
            res++;
        }
        
        // even
        rightInd = i;
        while( ++rightInd != s.length() && s[rightInd] == s[i]){
            if( (rightInd - i) % 2 == 1){
                res++;
            }
        }
    }
    
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
