#include <bits/stdc++.h>

using namespace std;

void printSet( const set<int>& s){
    cout << "[ ";
    for( auto it = s.begin(); it != s.end(); it++){
        cout << *it << ",";
    }
    cout << "]" << endl;
}

void printSets( const vector<set<int>>& sets){
    for( int i = 0; i < sets.size(); i++){
        printSet( sets[i]);
    }
}

vector<int> maxCircle(vector<vector<int>> queries) {
    vector<int> result;
    vector<set<int>> sets;
    map<int,int> m;
    int maxSize = 0;
    for( int i = 0; i < queries.size(); i++){
        int first = queries[ i][ 0];
        int second = queries[ i][ 1];
        
        int firstSetIndex = -1;
        int secondSetIndex = -1;
        
	auto it1 = m.find( first);
	if( it1 != m.end())
	    firstSetIndex = it1->second;
	
	auto it2 = m.find( second);
	if( it2 != m.end())
	    secondSetIndex = it2->second;
        
        if( firstSetIndex == secondSetIndex && firstSetIndex != -1 && secondSetIndex != -1){
        }
        
        else if( firstSetIndex == -1 && secondSetIndex == -1){
            set<int> s;
            s.insert( first);
            s.insert( second);
            if( s.size() > maxSize)
                maxSize = s.size();
                
            sets.push_back( s);
	    m[ first] = sets.size() - 1;
	    m[ second] = sets.size() - 1;
        }
        
        else if( firstSetIndex != -1 && secondSetIndex == -1){
            sets[ firstSetIndex].insert( second);
	    m[ second] = firstSetIndex;
            if( sets[ firstSetIndex].size() > maxSize)
                maxSize = sets[ firstSetIndex].size();
        }
        
        else if( firstSetIndex == -1 && secondSetIndex != -1){
            sets[ secondSetIndex].insert( first);
	    m[ first] = secondSetIndex;
            if( sets[ secondSetIndex].size() > maxSize)
                maxSize = sets[ secondSetIndex].size();
        }
        
        else{
            for( auto it = sets[secondSetIndex].begin(); it != sets[secondSetIndex].end(); it++){
                sets[firstSetIndex].insert( *it);
		m[*it] = firstSetIndex;
            }
            
            if( sets[ firstSetIndex].size() > maxSize)
                maxSize = sets[ firstSetIndex].size();
            
            //sets.erase( sets.begin() + secondSetIndex);
        }
        
        //cout << first << "-" << second << endl;
        //printSets( sets);
        //cout << "max: " << maxSize << endl << endl;
        result.push_back( maxSize);
    }
    
    /*for( int i = 0; i < result.size(); i++){
        cout << result[ i] << endl;
    }*/
    
    return result;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input08.txt");

    int q;
    fin >> q;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<vector<int>> queries(q);
    for (int i = 0; i < q; i++) {
        queries[i].resize(2);

        for (int j = 0; j < 2; j++) {
            fin >> queries[i][j];
        }

        fin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    vector<int> ans = maxCircle(queries);

    for (int i = 0; i < ans.size(); i++) {
        fout << ans[i];

        if (i != ans.size() - 1) {
            fout << "\n";
        }
    }

    fout << "\n";

    fout.close();

    return 0;
}
