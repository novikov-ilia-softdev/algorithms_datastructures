#include <bits/stdc++.h>

using namespace std;

int getMaxSet( const vector<set<int>>& sets){
    int maxSizeIndex = 0;
    if( sets.size() == 1)
        return sets[ maxSizeIndex].size();
    
    for( int i = 1; i < sets.size(); i++){
        if( sets[ i].size() > sets[ maxSizeIndex].size())
            maxSizeIndex = i;
    }
    
    return sets[ maxSizeIndex].size();
}

vector<int> maxCircle(vector<vector<int>> queries) {
    vector<int> result;
    vector<set<int>> sets;
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
        }
        
        if( firstSetIndex == -1 && secondSetIndex == -1){
            set<int> s;
            s.insert( first);
            s.insert( second);
            sets.push_back( s);
        }
        
        else if( firstSetIndex != -1 && secondSetIndex == -1){
            sets[ firstSetIndex].insert( second);
        }
        
        else if( firstSetIndex == -1 && secondSetIndex != -1){
            sets[ secondSetIndex].insert( first);
        }
        
        else{
            for( auto it = sets[secondSetIndex].begin(); it != sets[secondSetIndex].end(); it++){
                sets[firstSetIndex].insert( *it);
            }
            sets.erase( sets.begin() + secondSetIndex);
        }
        
        result.push_back( getMaxSet( sets));
    }
    
    return result;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int q;
    cin >> q;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<vector<int>> queries(q);
    for (int i = 0; i < q; i++) {
        queries[i].resize(2);

        for (int j = 0; j < 2; j++) {
            cin >> queries[i][j];
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');
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
