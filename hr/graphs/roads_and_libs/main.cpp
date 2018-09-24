#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

void traverseDFS( int city, const map<int, set<int>>& cityOnAdjacentsMap, set<int>& visited, int& count){
    if( visited.find( city) != visited.end())
        return;
    
    visited.insert( city);
    count++;
    
    auto it = cityOnAdjacentsMap.find(city);
    const set<int>& s = it->second;
    
    for( auto it = s.begin(); it != s.end(); it++){
        traverseDFS( *it, cityOnAdjacentsMap, visited, count);
    }
}

long roadsAndLibraries(int n, int c_lib, int c_road, vector<vector<int>> cities) {
    if( c_lib <= c_road)
	return (long)c_lib * n;
        
    map<int, set<int>> cityOnAdjacentsMap;
    for( int i = 0; i < cities.size(); i++){
        auto itFirst = cityOnAdjacentsMap.find( cities[i][0]);
        if( itFirst == cityOnAdjacentsMap.end()){
            set<int> s;
            s.insert( cities[i][1]);
            cityOnAdjacentsMap.insert(pair<int, set<int>>( cities[i][0], s));
        }
        else{
            itFirst->second.insert( cities[i][1]);
        }
        
        auto itSecond = cityOnAdjacentsMap.find( cities[i][1]);
        if( itSecond == cityOnAdjacentsMap.end()){
            set<int> s;
            s.insert( cities[i][0]);
            cityOnAdjacentsMap.insert(pair<int, set<int>>( cities[i][1], s));
        }
        else{
            itSecond->second.insert( cities[i][0]);
        }
    }
    
    long res = 0;
    set<int> visited;
    for( auto it = cityOnAdjacentsMap.begin(); it != cityOnAdjacentsMap.end(); it++){
        if( visited.find( it->first) == visited.end()){
            int count = 0;
            traverseDFS( it->first, cityOnAdjacentsMap, visited, count);
	    res += (count - 1) * c_road + c_lib;
        }
    }
    
    long diff = n - visited.size();
    if( diff > 0)
        res += diff * c_lib;
    
    return res;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input04.txt");

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
