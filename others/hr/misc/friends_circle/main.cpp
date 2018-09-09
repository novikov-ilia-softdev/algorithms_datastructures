#include <bits/stdc++.h>

using namespace std;

void print( const map<int,int>& m){
    //cout << "[ ";
    for( auto it = m.begin(); it != m.end(); it++){
        cout << it->first << "," << it->second << endl;
    }
}

int getParent( const map<int,int>& m, int val){
    auto it = m.find( val);
    if( it == m.end()){
	return -1;
    }
    else{
	while( it->first != it->second){
	    it = m.find( it->second);
	}
	return it->second;
    }
}

vector<int> maxCircle(vector<vector<int>> queries) {
    vector<int> result;
    map<int,int> valOnParentMap;
    map<int,int> parentOnSizeMap;
    int maxSize = 0;
    for( int i = 0; i < queries.size(); i++){
        int first = queries[ i][ 0];
        int second = queries[ i][ 1];
        
        int firstParent = getParent( valOnParentMap, first);
        int secondParent = getParent( valOnParentMap, second);
        
        if( firstParent == secondParent && firstParent != -1 && secondParent != -1){
        }
        
        else if( firstParent == -1 && secondParent == -1){
            int minVal = min( first, second);
	    valOnParentMap[ first] = minVal;
	    valOnParentMap[ second] = minVal;
	    parentOnSizeMap[ minVal] = 2;
	    if( 2 > maxSize)
		maxSize = 2;
        }
        
        else if( firstParent != -1 && secondParent == -1){
            valOnParentMap[ second] = firstParent;
	    parentOnSizeMap[ firstParent]++;
	    if( parentOnSizeMap[ firstParent] > maxSize)
		maxSize = parentOnSizeMap[ firstParent];
        }
        
        else if( firstParent == -1 && secondParent != -1){
            valOnParentMap[ first] = secondParent;
	    parentOnSizeMap[ secondParent]++;
	    if( parentOnSizeMap[ secondParent] > maxSize)
		maxSize = parentOnSizeMap[ secondParent];
        }
        
        else{
	    cout << "firstParent:" << firstParent <<endl;
	    cout << "secondParent:" << secondParent <<endl;
	    if( firstParent < secondParent){
		valOnParentMap[secondParent] = firstParent;
		parentOnSizeMap[ firstParent] += parentOnSizeMap[ secondParent];
		if( parentOnSizeMap[ firstParent] > maxSize)
		    maxSize = parentOnSizeMap[ firstParent];
		parentOnSizeMap.erase( parentOnSizeMap.find( secondParent));
	    }
	    else{
		valOnParentMap[firstParent] = secondParent;
		parentOnSizeMap[ secondParent] += parentOnSizeMap[ firstParent];
		if( parentOnSizeMap[ secondParent] > maxSize)
		    maxSize = parentOnSizeMap[ secondParent];
		parentOnSizeMap.erase( parentOnSizeMap.find( firstParent));
	    }
        }
        
        /*cout << first << "-" << second << endl;
	cout << "valOnParentMap:" << endl;
        print( valOnParentMap);
	cout << "parentOnSizeMap:" << endl;
	print( parentOnSizeMap);
        cout << "max: " << maxSize << endl << endl;
	cout << endl;*/
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
    ifstream fin("input03.txt");

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
