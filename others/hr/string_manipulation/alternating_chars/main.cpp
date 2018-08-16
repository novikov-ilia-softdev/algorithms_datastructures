#include <bits/stdc++.h>

using namespace std;

// Complete the alternatingCharacters function below.
int alternatingCharacters(string s) {
    if( s.length() == 0 || s.length() == 1)
        return 0;
    
    int deleteCount = 0;
    char cur = s[ 0];
    int index = 1;
    
    while( index != s.length()){
        if( cur == s[index])
            deleteCount++;
    
        cur = s[index];
        index++;
    }
    
    return deleteCount;
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

        int result = alternatingCharacters(s);

        fout << result << "\n";
    }

    fout.close();

    return 0;
}
