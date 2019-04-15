#include <bits/stdc++.h>

using namespace std;

std::string str_toupper(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(), 
                // static_cast<int(*)(int)>(std::toupper)         // неправильно
                // [](int c){ return std::toupper(c); }           // неправильно
                // [](char c){ return std::toupper(c); }          // неправильно
                   [](unsigned char c){ return std::toupper(c); } // правильно
                  );
    return s;
}

string abbreviation(string a, string b) {
    
    cout << endl << "a: " << a << ", b:" << b << endl;
    
    bool bInA = false;
    //if (a.find( b) != string::npos){
	//return "NO";
    //}
    a = str_toupper( a);
    
    /*for( auto& c: a){
        c = toupper( c);
    }*/
    
    if (a.find( b) == string::npos){
	cout << "NO" << endl;
	return "NO";
    }
	
    
    cout << "YES" << endl;
    return "YES";
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input01.txt");

    int q;
    fin >> q;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int q_itr = 0; q_itr < q; q_itr++) {
        string a;
        getline(fin, a);

        string b;
        getline(fin, b);

        string result = abbreviation(a, b);

        fout << result << "\n";
    }

    fout.close();

    return 0;
}
