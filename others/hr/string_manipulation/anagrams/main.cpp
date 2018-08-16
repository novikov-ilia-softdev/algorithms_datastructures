#include <bits/stdc++.h>

using namespace std;

const int CharsCount = 26;

void fillFreq(int* freq, const string& str) {
    for(int i = 0; str[i] != '\0'; i++)
    {
        freq[ str[i] - 'a']++;
    }
}

// Complete the makeAnagram function below.
int makeAnagram(string a, string b) {
    int freqA[CharsCount] = {0};
    int freqB[CharsCount] = {0};
    fillFreq( freqA, a);
    fillFreq( freqB, b);
    
    int result = 0;
    for( int i = 0; i < CharsCount; i++)
    {
        result += abs( freqA[i] - freqB[i]);
    }
    
    return result;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string a;
    getline(cin, a);

    string b;
    getline(cin, b);

    int res = makeAnagram(a, b);

    fout << res << "\n";

    fout.close();

    return 0;
}
