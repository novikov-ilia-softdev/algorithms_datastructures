#include <bits/stdc++.h>

using namespace std;

hash<std::string> hash_fn;

size_t makeKey( const string& a, const string& b){
    return hash_fn( a + "_" + b);
}

typedef unordered_set<size_t> Visited;

bool isPossibleToTransform(const string& a, const string& b){
    static Visited visited;
    
    bool retval = false;
    
    if( a.empty() && b.empty())
	return true;
	
    if (a.size() < b.size())
        return false;
	 
    if (isupper(a[0]) && a[0] != b[0])
        return false;
    
    if( visited.find( makeKey(a, b)) != visited.end())
	return false;
    
    if( isupper( a[ 0])){
	if( a[ 0] == b[ 0])
	    retval = isPossibleToTransform( a.substr( 1), b.substr( 1));
    }
    else{
	if (toupper(a[0]) != b[0])
	    retval = isPossibleToTransform( a.substr( 1), b);
	else
	    retval = (isPossibleToTransform( a.substr( 1), b) || isPossibleToTransform( a.substr( 1), b.substr( 1)));
    }
    
    if( !retval)
	visited.insert( makeKey(a, b));
    
    return retval;
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
    time_t start, end;
    time(&start);
    
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
    
    time(&end);
	
    double time_taken = double(end - start); 
    cout << "Time taken by program is : " << fixed << time_taken << setprecision(5); 
    cout << " sec " << endl;

    return 0;
}
