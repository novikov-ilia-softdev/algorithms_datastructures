#include <bits/stdc++.h>

#include <algorithm>
using namespace std;

vector<string> split_string(string);

int superDigit(string s, int k) {    
    if( s.length() == 1)
        return stoi( s);
    
    vector<int> digits;
    for(int i = 0; i < s.length(); i++){   
        char ch = s[i];
        digits.push_back( atoi(&ch)); 
    }
    
    long sum = 0;
    for_each( digits.begin(), digits.end(), [ &sum](int &n){ sum += n; });
    sum *= k;
    
    return superDigit( to_string( sum), 1);
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string nk_temp;
    getline(cin, nk_temp);

    vector<string> nk = split_string(nk_temp);

    string n = nk[0];

    int k = stoi(nk[1]);

    int result = superDigit(n, k);

    fout << result << "\n";

    fout.close();

    return 0;
}

vector<string> split_string(string input_string) {
    string::iterator new_end = unique(input_string.begin(), input_string.end(), [] (const char &x, const char &y) {
        return x == y and x == ' ';
    });

    input_string.erase(new_end, input_string.end());

    while (input_string[input_string.length() - 1] == ' ') {
        input_string.pop_back();
    }

    vector<string> splits;
    char delimiter = ' ';

    size_t i = 0;
    size_t pos = input_string.find(delimiter);

    while (pos != string::npos) {
        splits.push_back(input_string.substr(i, pos - i));

        i = pos + 1;
        pos = input_string.find(delimiter, i);
    }

    splits.push_back(input_string.substr(i, min(pos, input_string.length()) - i + 1));

    return splits;
}
