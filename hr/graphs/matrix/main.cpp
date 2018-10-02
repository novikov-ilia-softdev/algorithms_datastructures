#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

typedef map<int, vector<pair<int,int>>> NodeOnAdjacentsMap;

void addConnection( NodeOnAdjacentsMap& map, int src, int dst, int time){
    auto it = map.find( src);
    if( it == map.end()){
        vector<pair<int,int>> v;
        v.push_back( pair<int,int>( dst, time));
        map.insert( pair<int, vector<pair<int,int>>>( src, v));
    }
    else{
        it->second.push_back( pair<int,int>( dst, time));
    }
}

bool isMachine( int node, const vector<int>& machines){
    for(int i = 0; i < machines.size(); i++){
	if( node == machines[ i])
	    return true;
    }
    
    return false;
}

void doDFS( int node, int roadTime, NodeOnAdjacentsMap& map, set<int>& visited, int& time, const vector<int>& machines, vector<int> path){
    cout << "doDFS - " << "node: " << node << ", roadTime: " << roadTime << endl;
    if( visited.find( node) != visited.end())
	return;
    
    visited.insert( node);
    path.push_back( roadTime);
    
    if( isMachine( node, machines)){
	cout << "isMachine: " << node << endl;
	sort( path.begin(), path.end());
        
        
        if( notDestr)
	time += path[ 0];
	cout << "add time " << path[ 0] << endl;
	return;
    }
	
    auto it = map.find( node);
    for( int i = 0; i < it->second.size(); i++){
	doDFS( it->second[i].first, it->second[i].second, map, visited, time, machines, path);
    }
}

void isolate( int machine, NodeOnAdjacentsMap& map, int& time, const vector<int>& machines){
    cout << endl << "isolate: " << machine << endl;
    auto it = map.find( machine);
    
    set<int> visited;
    visited.insert( machine);
    vector<int> path;
    for( int i = 0; i < it->second.size(); i++){
	doDFS( it->second[i].first, it->second[i].second, map, visited, time, machines, path);
    }
}

int minTime(vector<vector<int>> roads, vector<int> machines) {
    // first - node
    // second - time
    NodeOnAdjacentsMap nodeOnAdjacentsMap;
    
    for(int i = 0; i < roads.size(); i++){
        addConnection( nodeOnAdjacentsMap, roads[ i][0], roads[ i][1], roads[ i][2]);
        addConnection( nodeOnAdjacentsMap, roads[ i][1], roads[ i][0], roads[ i][2]);
    }
    
    int time = 0;
    
    for( int i = 0; i < machines.size(); i++){
        isolate( machines[ i], nodeOnAdjacentsMap, time, machines);
    }

    cout << "res" << time << endl;
    return time / 2;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input10.txt");

    string nk_temp;
    getline(fin, nk_temp);

    vector<string> nk = split_string(nk_temp);

    int n = stoi(nk[0]);

    int k = stoi(nk[1]);

    vector<vector<int>> roads(n - 1);
    for (int i = 0; i < n - 1; i++) {
        roads[i].resize(3);

        for (int j = 0; j < 3; j++) {
            fin >> roads[i][j];
        }

        fin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    vector<int> machines(k);

    for (int i = 0; i < k; i++) {
        int machines_item;
        fin >> machines_item;
        fin.ignore(numeric_limits<streamsize>::max(), '\n');

        machines[i] = machines_item;
    }

    int result = minTime(roads, machines);

    fout << result << "\n";

    fout.close();

    return 0;
}

vector<string> split_string(string input_string) {
    string::iterator new_end = unique(input_string.begin(), input_string.end(), [] (const char &x, const char &y) {
        return x == y and x == ' ';
    });

    input_string.erase(new_end, input_string.end());

    while (input_string[input_string.length() - 1] == ' ') {
        input_string.pop_back();
    }

    vector<string> splits;
    char delimiter = ' ';

    size_t i = 0;
    size_t pos = input_string.find(delimiter);

    while (pos != string::npos) {
        splits.push_back(input_string.substr(i, pos - i));

        i = pos + 1;
        pos = input_string.find(delimiter, i);
    }

    splits.push_back(input_string.substr(i, min(pos, input_string.length()) - i + 1));

    return splits;
}
