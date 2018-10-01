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

void isolate( int machine, NodeOnAdjacentsMap& map, int& time){
    auto it = map.find( machine);
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
        isolate( machines[ i], nodeOnAdjacentsMap, time);
    }

    return time;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string nk_temp;
    getline(cin, nk_temp);

    vector<string> nk = split_string(nk_temp);

    int n = stoi(nk[0]);

    int k = stoi(nk[1]);

    vector<vector<int>> roads(n - 1);
    for (int i = 0; i < n - 1; i++) {
        roads[i].resize(3);

        for (int j = 0; j < 3; j++) {
            cin >> roads[i][j];
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    vector<int> machines(k);

    for (int i = 0; i < k; i++) {
        int machines_item;
        cin >> machines_item;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

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
