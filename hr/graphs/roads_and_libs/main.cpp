#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

void dbgPrintVector( const vector<int>& v){
    for( auto it = v.begin(); it != v.end(); it++){
        cout << *it << ", ";
    }
}

void dbgPrintMap( const map<int, vector<int>>& m){
    for( auto it = m.begin(); it != m.end(); it++){
        cout << it->first << ": ";
        dbgPrintVector( it->second);
        cout << endl;
    }
}

void traverseDFS( int city, const map<int, vector<int>>& adjacents, set<int>& visited){
    if( s.find( city) != s.end())
        return;
    
    s.insert( city);
    
    auto it = adjacents[ city];
    vector<int>& v = it->second;
    
    for( int i = 0; i < v.size(); i++){
        traverseDFS( v[ i], adjacents, visited);
    }
}

long roadsAndLibraries(int n, int c_lib, int c_road, vector<vector<int>> cities) {
    if( c_lib <= c_road)
        return c_lib * n;
    
    map<int, vector<int>> adjacents;
    for( int i = 0; i < cities.size(); i++){
        auto itFirst = adjacents.find( cities[i][0]);
        if( itFirst == adjacents.end()){
            vector<int> v;
            v.push_back( cities[i][1]);
            adjacents.insert(pair<int, vector<int>>( cities[i][0], v));
        }
        else{
            itFirst->second.push_back( cities[i][1]);
        }
        
        auto itSecond = adjacents.find( cities[i][1]);
        if( itSecond == adjacents.end()){
            vector<int> v;
            v.push_back( cities[i][0]);
            adjacents.insert(pair<int, vector<int>>( cities[i][1], v));
        }
        else{
            itSecond->second.push_back( cities[i][0]);
        }
    }
    
    dbgPrintMap( adjacents);
    
    vector< set<int>> visited;
    set<int> s;
    visited.push_back( s);
    for( auto it = m.begin(); it != m.end(); it++){
        traverseDFS( it->first, adjacents, visited);
    }
    
    return 0;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input00.txt");

    int q;
    fin >> q;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int q_itr = 0; q_itr < q; q_itr++) {
        string nmC_libC_road_temp;
        getline(fin, nmC_libC_road_temp);

        vector<string> nmC_libC_road = split_string(nmC_libC_road_temp);

        int n = stoi(nmC_libC_road[0]);

        int m = stoi(nmC_libC_road[1]);

        int c_lib = stoi(nmC_libC_road[2]);

        int c_road = stoi(nmC_libC_road[3]);

        vector<vector<int>> cities(m);
        for (int i = 0; i < m; i++) {
            cities[i].resize(2);

            for (int j = 0; j < 2; j++) {
                fin >> cities[i][j];
            }

            fin.ignore(numeric_limits<streamsize>::max(), '\n');
        }

        long result = roadsAndLibraries(n, c_lib, c_road, cities);

        fout << result << "\n";
    }

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
