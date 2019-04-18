#include <bits/stdc++.h>

using namespace std;

string abbreviation(string a, string b) {
    
    //cout << endl << "a: " << a << ", b:" << b << endl;
    
    int expected = 0;
    
    // lower letter : delete or up?
    
    for( int i = 0; i < a.size(); i++){
         cout << "i:" << i << "(" << a[i] << ")" << ", expected: " << expected << endl;
	
	if( expected == b.size() && isupper(a[i])){
	    cout << "NO after upper" << endl;
	    return "NO";
	}
            
        
        if (isupper(a[i])){
            if(a[i] != b[expected]){
                if( a[i] == b[0]){
                    expected = 1;
                    continue;
                }
                
                cout << "NO before upper" << endl;
                return "NO";
            }
            
            else{
                expected++;
                continue;
            }
        }
        
        if( toupper( a[i]) == b[ expected])
            expected++;
    }
    
    if( expected == b.size()){
	cout << "final YES" << endl;
	return "YES";
    }
        
    cout << "final NO " << endl;
    return "NO";
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input06.txt");

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
