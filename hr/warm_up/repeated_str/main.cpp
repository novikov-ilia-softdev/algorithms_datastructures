#include <bits/stdc++.h>

using namespace std;

long repeatedString(string s, long n) {
    long countInOneString = 0;
    long partStrSize = n % s.length();
    long countInTail = 0;
    for( long i = 0; i < s.length(); i++){
        if( s[i] == 'a'){
            if( i < partStrSize)
                countInTail++;
            
            countInOneString++;
        }  
    }
    
    long countStrings = n / s.length();
    long res = countInOneString * countStrings + countInTail;

    return res;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string s;
    getline(cin, s);

    long n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    long result = repeatedString(s, n);

    fout << result << "\n";

    fout.close();

    return 0;
}
