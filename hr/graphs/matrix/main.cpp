#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

class Matrix{
public:
    Matrix();
    void addConnection( int src, int dst, int time);
    void addMachine( int machine);
    void makeSave();
    int getTime() const;
    
private:
    void isolate_( int machine);
    void doDFS_( int src, int dst, int time, set<int>& visited){

private:
    typedef map<int, vector<pair<int,int>>> NodeOnAdjacentsMap;
    NodeOnAdjacentsMap nodeOnAdjacentsMap_;
    set<int> machines_;
    int time_;
};

Matrix() : time_( 0) {}

void Matrix::addConnection( int src, int dst, int time){
    auto it = nodeOnAdjacentsMap_.find( src);
    if( it == nodeOnAdjacentsMap_.end()){
        vector<pair<int,int>> v;
        v.push_back( pair<int,int>( dst, time));
        nodeOnAdjacentsMap_.insert( pair<int, vector<pair<int,int>>>( src, v));
    }
    else{
        it->second.push_back( pair<int,int>( dst, time));
    }
}

void Matrix::addMachine( int machine){
    machines_.insert( machine);
}

int Matrix::getTime() const{
    return time_;
}

void Matrix::makeSave(){
    for( auto it = machines_.begin(); it != machines_.end(); it++){
        isolate_( *it);
    }
}

void Matrix::isolate_( int machine){
    set<int> visited;
    visited.insert( machine)
    for( int i = 0; i < nodeOnAdjacentsMap_[ machine].size(); i++){
        doDFS_( machine, nodeOnAdjacentsMap_[ machine][i].first, nodeOnAdjacentsMap_[ machine][i].dst, visited);
    }
}

void Matrix::doDFS_( int src, int dst, int time, set<int>& visited){
    if( visited.find( dst) != visited.end())
	return;
    
    visited.insert( dst);
    
    if( isMachine( dst)){
        
    }
    
    
}

int minTime(vector<vector<int>> roads, vector<int> machines) {
    
    Matrix matrix;
    
    for(int i = 0; i < roads.size(); i++){
        matrix.addConnection( roads[ i][0], roads[ i][1], roads[ i][2]);
        matrix.addConnection( roads[ i][1], roads[ i][0], roads[ i][2]);
    }
    
    for( int i = 0; i < machines.size(); i++){
        matrix.addMachine( machines[ i]);
    }
    
    matrix.makeSave();

    return matrix.getTime();
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
