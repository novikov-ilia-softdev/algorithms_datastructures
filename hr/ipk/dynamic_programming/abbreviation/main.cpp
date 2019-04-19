#include <bits/stdc++.h>

using namespace std;
/*
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
*/

bool isPossibleToTransform(string a, string b){
    cout << "a: " << a << ", b:" << b << endl;
    cin.get();
    
    if( a == "" && b == ""){
        cout << "true" << endl;
        return true;
    }
        
    if( a == ""){
        cout << "false (a empty)" << endl;
        return false;
    }
        
    if( b == ""){
        if( isupper( a[0])){
            cout << "false (b empty, a[0] is upper)" << endl;
            return false;
        }
            
        
        return isPossibleToTransform( a.substr( 1), b);
    }
        
    if( islower( a[0])){
        a[ 0] = toupper( a[0]);
            if( isPossibleToTransform( a, b)){
                cout << "false (a[0] up)" << endl;
                return true;
            }
                
        if( isPossibleToTransform( a.substr( 1), b)){
            cout << "false (a[0] delete)" << endl;
            return true;
        }
    }
    
    if( a[ 0] == b[ 0])
        return isPossibleToTransform( a.substr( 1), b.substr( 1));
    else{
        cout << "false (a[ 0] != b[ 0])" << endl;
        return false;
    }
    
    //cout << "false (no way)" << endl;
    return false;
}

string abbreviation(string a, string b) {
    
    if( isPossibleToTransform( a, b)){
        cout << "YES" << endl;
        return "YES";
    }
        
    cout << "NO" << endl;
    return "NO";
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input12_2.txt");

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
