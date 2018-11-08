#include <bits/stdc++.h>

#include<set>
using namespace std;

void fillSet(set<string>& set, const string& s) {
    if( s == "")
        return;
    
    for( int i = 0; i < s.length(); i++){
        set.insert( s.substr(0, i + 1));
    }
    
    fillSet( set, s.substr( 1));
}

void showSet(const set<string>& set) {
    for( auto it = set.begin(); it != set.end(); it++)
    {
        std::cout << *it << " ";
    }
    std::cout << std::endl;
}

// Complete the twoStrings function below.
string twoStrings(string s1, string s2) {
    // quick
    for( int i = 0; i < s1.length(); i++){
        if( s2.find( s1[i]) != std::string::npos)
            return "YES";
    }
    
    return "NO";

    // full

    set<string> set1;
    set<string> set2;
    fillSet( set1, s1);
    fillSet( set2, s2);
    /*
    std::cout << "s1: " << s1 << std::endl;
    std::cout << "set1: ";
    showSet( set1);
    
    std::cout << "s2: " << s2 << std::endl;
    std::cout << "set2: ";
    showSet( set2);
    std::cout << std::endl;
    */
    
    for( auto it = set1.begin(); it != set1.end(); it++)
    {
        if( set2.find( *it) != set2.end())
            return "YES";
    }
    
    return "NO";
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int q;
    cin >> q;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int q_itr = 0; q_itr < q; q_itr++) {
        string s1;
        getline(cin, s1);

        string s2;
        getline(cin, s2);

        string result = twoStrings(s1, s2);

        fout << result << "\n";
    }

    fout.close();

    return 0;
}
