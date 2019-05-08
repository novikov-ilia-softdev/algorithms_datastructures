#include <bits/stdc++.h>

using namespace std;

/*
string makeKey( const string& a, const string& b){
    return a + "_" + b;
}
*/

hash<std::string> hash_fn;

size_t makeKey( const string& a, const string& b){
    return hash_fn( a + "_" + b);
}

typedef unordered_set<size_t> Visited;

bool isPossibleToTransform(const string& a, const string& b, Visited& visited){
    
    if( a.empty() && b.empty()){
	return true;
    }
	
    if( a.empty() && !b.empty()){
	return false;
    }
	 
    if( !a.empty() && b.empty()){
        for( auto c: a){
	    if( isupper( c))
		return false;
	}
	
	return true;
    }
    
    if( visited.find( makeKey(a, b)) != visited.end())
	return false;
        
    if( islower( a[0])){
	// up
	if( toupper(a[0]) == b[ 0] && isPossibleToTransform( a.substr( 1), b.substr( 1), visited))
	    return true;
	   
	// delete
        if( isPossibleToTransform( a.substr( 1), b, visited))
	    return true;
    }
    else{
	if( a[ 0] == b[ 0] && isPossibleToTransform( a.substr( 1), b.substr( 1), visited))
	    return true;
    }
    
    visited.insert( makeKey(a, b));
    return false;
}

string abbreviation(string a, string b) {
    Visited visited;
    
    if( isPossibleToTransform( a, b, visited)){
        //cout << "YES" << endl;
        return "YES";
    }
        
    //cout << "NO" << endl;
    return "NO";
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input13.txt");
    
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
