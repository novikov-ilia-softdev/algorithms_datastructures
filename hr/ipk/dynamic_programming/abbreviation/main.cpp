#include <bits/stdc++.h>

using namespace std;

string makeKey( const string& a, const string& b){
    return a + "_" + b;
}

bool isPossibleToTransform(const string& a, const string& b){
    
    static unordered_map<string, bool> visited;
    
    if( visited.find( makeKey(a, b)) != visited.end())
	return visited[ makeKey(a, b)];
    
    if( a.empty() && b.empty()){
	return true;
    }
	
    if( a.empty() && !b.empty()){
	visited[ makeKey(a, b)] = false;
	return false;
    }
	 
    if( !a.empty() && b.empty()){
        if( isupper( a[0])){
	    visited[ makeKey(a, b)] = false;
	    return false;
	}
	    
	bool res = isPossibleToTransform( a.substr( 1), b);
	visited[ makeKey(a, b)] = res;
	return res;
    }
        
    if( islower( a[0])){
	string copyA = a;
	copyA[ 0] = toupper( copyA[0]);
	
	if( isPossibleToTransform( copyA, b)){
	    return true;
	}
	   
        if( isPossibleToTransform( a.substr( 1), b)){
	    return true;
	}
            
	visited[ makeKey(a, b)] = false;
        return false;
    }
    
    if( a[ 0] == b[ 0]){
	bool res = isPossibleToTransform( a.substr( 1), b.substr( 1));
	visited[ makeKey(a, b)] = res;
	return res;
    }
	
    visited[ makeKey(a, b)] = false;
    return false;
}

string abbreviation(string a, string b) {
    
    if( isPossibleToTransform( a, b)){
        //cout << "YES" << endl;
        return "YES";
    }
        
    //cout << "NO" << endl;
    return "NO";
}

int main()
{
    srand (time(NULL));
    
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
