#include <bits/stdc++.h>

using namespace std;

int countingValleys(int n, string s) {
    int curLevel = 0;
    int countValleys = 0;
    bool valleyStarted = false;
    for( int i = 0; i < s.length(); i++){
        if( s[ i] == 'U'){
            curLevel++;
            if( curLevel == 0 && valleyStarted)
                countValleys++;
        }
        else if( s[i] == 'D'){
            curLevel--;
            if( curLevel < 0)
               valleyStarted = true; 
        }
    }
    
    return countValleys;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    string s;
    getline(cin, s);

    int result = countingValleys(n, s);

    fout << result << "\n";

    fout.close();

    return 0;
}
