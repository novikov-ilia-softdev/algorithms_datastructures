#include <bits/stdc++.h>

#include <vector>
using namespace std;

const int CharsCount = 26;

void fillFreq(int* freq, const string& str) {
    for(int i = 0; str[i] != '\0'; i++)
    {
        freq[ str[i] - 'a']++;
    }
}

bool isAnagram( const string& a, const string& b)
{
    int freqA[CharsCount] = {0};
    int freqB[CharsCount] = {0};
    fillFreq( freqA, a);
    fillFreq( freqB, b);
    
    int result = 0;
    for( int i = 0; i < CharsCount; i++)
    {
        result += abs( freqA[i] - freqB[i]);
    }
    
    return result == 0;
}

int getAnagramsCount( const string& s, int substrLength) {
    vector<string> substrings;
    int countSubstr = s.length() - substrLength + 1;
    for( int i = 0; i < countSubstr; i++)
    {
        substrings.push_back( s.substr( i, substrLength));
    }
    
    int result = 0;
    
    for( int i = 0; i < substrings.size() - 1; i++)
    {
        for( int j = i + 1; j < substrings.size(); j++)
        {
            if( isAnagram( substrings[ i], substrings[ j]))
                result++;
        }
    }
    
    return result;
}

// Complete the sherlockAndAnagrams function below.
int sherlockAndAnagrams(string s) {
    int countAnagrams = 0;
    
    for( int i = 1; i <= s.length() - 1; i++)
    {
        countAnagrams += getAnagramsCount( s, i);
    }
    
    return countAnagrams;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int q;
    cin >> q;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int q_itr = 0; q_itr < q; q_itr++) {
        string s;
        getline(cin, s);

        int result = sherlockAndAnagrams(s);

        fout << result << "\n";
    }

    fout.close();

    return 0;
}
