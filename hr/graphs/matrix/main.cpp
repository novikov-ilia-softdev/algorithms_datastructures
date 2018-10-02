#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

struct Road{
    Road( int s, int d, int t): src( s), dst( d), time( t) {}
    int src;
    int dst;
    int time;
};

class Matrix{
public:
    Matrix();
    void addConnection( int src, int dst, int time);
    void addMachine( int machine);
    void makeSave();
    int getTime() const;
    
private:
    void isolate_( int machine);
    void doDFS_( int src, int dst, int time, set<int>& visited, Road roadToDestroy);
    bool isMachine_( int node);
    bool isRoadDestroyed_( Road roadToDestroy);
    void destroyRoad_( Road roadToDestroy);

private:
    typedef map<int, vector<pair<int,int>>> NodeOnAdjacentsMap;
    NodeOnAdjacentsMap nodeOnAdjacentsMap_;
    set<int> machines_;
    int time_;
    set<string> destroyedRoads_;
};

Matrix::Matrix() : time_( 0) {}

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
    visited.insert( machine);
    for( int i = 0; i < nodeOnAdjacentsMap_[ machine].size(); i++){
        int nextNode = nodeOnAdjacentsMap_[ machine][i].first;
        int time = nodeOnAdjacentsMap_[ machine][i].second;
        Road roadToDestroy( machine, nextNode, time);
        doDFS_( machine, nextNode, time, visited, roadToDestroy);
    }
}

void Matrix::doDFS_( int src, int dst, int time, set<int>& visited, Road roadToDestroy){
    if( visited.find( dst) != visited.end())
	return;
    
    visited.insert( dst);
    if( time < roadToDestroy.time){
        roadToDestroy.src = src;
        roadToDestroy.dst = dst;
        roadToDestroy.time = time;
    }
    
    if( isMachine_( dst) && !isRoadDestroyed_( roadToDestroy)){
        destroyRoad_( roadToDestroy);
        time_ += roadToDestroy.time;
        return;
    }
    
    for( int i = 0; i < nodeOnAdjacentsMap_[ dst].size(); i++){
        int nextNode = nodeOnAdjacentsMap_[ dst][i].first;
        int time = nodeOnAdjacentsMap_[ dst][i].second;
        doDFS_( dst, nextNode, time, visited, roadToDestroy);
    }
}

bool Matrix::isMachine_( int node){
    return (machines_.find( node) != machines_.end());
}

bool Matrix::isRoadDestroyed_( Road roadToDestroy){
    return (destroyedRoads_.find( roadToDestroy.src + "_" + roadToDestroy.dst) != destroyedRoads_.end() ||
            destroyedRoads_.find( roadToDestroy.dst + "_" + roadToDestroy.src) != destroyedRoads_.end()
    );
}

void Matrix::destroyRoad_( Road roadToDestroy){
    cout << "destroyRoad_: " << roadToDestroy.src << "-" << roadToDestroy.dst << " (" << roadToDestroy.time << ")" << endl;
    destroyedRoads_.insert( roadToDestroy.src + "_" + roadToDestroy.dst);
    destroyedRoads_.insert( roadToDestroy.dst + "_" + roadToDestroy.src);
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

    cout << matrix.getTime() << endl;
    return matrix.getTime();
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input01.txt");

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
