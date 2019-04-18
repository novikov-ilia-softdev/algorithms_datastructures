#include <bits/stdc++.h>

using namespace std;

string abbreviation(string a, string b) {
    
    cout << endl << "a: " << a << ", b:" << b << endl;
    
    set<int> wasBig;
    for( int i = 0; i < a.size(); i++){
        if( isupper(a[i]))
            wasBig.insert( i);
        else
            a[i] = toupper( a[i]);
    }
    
    int startIndex = a.find( b);
    
    if (startIndex == string::npos){
	cout << "NO" << endl;
	return "NO";
    }
	
    for( int i = 0; i < a.size(); i++){
        if( i >= startIndex && i <= startIndex + b.size())
            continue;
        
        if( wasBig.find( i) != wasBig.end()){
            cout << "was big NO" << endl;
            return "NO";
        }
    }
    
    cout << "YES" << endl;
    return "YES";
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input15.txt");

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
