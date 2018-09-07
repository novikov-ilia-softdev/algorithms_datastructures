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
    int maxSize = 0;
    for( int i = 0; i < queries.size(); i++){
        int first = queries[ i][ 0];
        int second = queries[ i][ 1];
        
        int firstSetIndex = -1;
        int secondSetIndex = -1;
        
        for( int j = 0; j < sets.size(); j++){
            auto tempFirstIt = sets[ j].find( first);
            if( tempFirstIt != sets[ j].end())
                firstSetIndex = j;
            
            auto tempSecondIt = sets[ j].find( second);
            if( tempSecondIt != sets[ j].end())
                secondSetIndex = j;
            
            if( firstSetIndex != -1 && secondSetIndex != -1)
                break;
        }
        
        //cout << "WOW1" << endl;
        
        if( firstSetIndex == secondSetIndex && firstSetIndex != -1 && secondSetIndex != -1){
            //cout << "WOW2" << endl;
        }
        
        else if( firstSetIndex == -1 && secondSetIndex == -1){
            //cout << "WOW3" << endl;
            set<int> s;
            s.insert( first);
            s.insert( second);
            //cout << "s.size(): " << s.size() << endl;
            //cout << "maxSize: " << maxSize << endl;
            //cout << "s.size() > maxSize: " << (s.size() > maxSize) << endl;
            if( s.size() > maxSize){
                
                //cout << "WOW!!!!!!!!!!!" << endl;
                maxSize = s.size();
            }
                
            sets.push_back( s);
        }
        
        else if( firstSetIndex != -1 && secondSetIndex == -1){
            //cout << "WOW4" << endl;
            sets[ firstSetIndex].insert( second);
            if( sets[ firstSetIndex].size() > maxSize)
                maxSize = sets[ firstSetIndex].size();
        }
        
        else if( firstSetIndex == -1 && secondSetIndex != -1){
            //cout << "WOW5" << endl;
            sets[ secondSetIndex].insert( first);
            if( sets[ secondSetIndex].size() > maxSize)
                maxSize = sets[ secondSetIndex].size();
        }
        
        else{
            //cout << "WOW6" << endl;
            for( auto it = sets[secondSetIndex].begin(); it != sets[secondSetIndex].end(); it++){
                sets[firstSetIndex].insert( *it);
            }
            
            if( sets[ firstSetIndex].size() > maxSize)
                maxSize = sets[ firstSetIndex].size();
            
            sets.erase( sets.begin() + secondSetIndex);
	    //cout << "s.size(): " << sets[firstSetIndex].size() << endl;
            //cout << "maxSize: " << maxSize << endl;
            //cout << "sets[firstSetIndex].size() > maxSize: " << (sets[firstSetIndex].size() > maxSize) << endl;
            //if( sets[ firstSetIndex].size() + sets[ secondSetIndex].size() > maxSize)
            //    maxSize = sets[ firstSetIndex].size() + sets[ secondSetIndex].size();
            
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
