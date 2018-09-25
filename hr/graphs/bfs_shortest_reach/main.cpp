#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <map>
#include <queue>
#include <set>
using namespace std;

class Graph {
public:
    Graph(int n);
    void add_edge(int u, int v);
    vector<int> shortest_reach(int start);
    
private:
    void addConnection_( int u, int v);
    
private:
    int nodesCount_;
    map<int, set<int>> nodeOnAdjacentsMap_;
};

Graph::Graph(int n) : nodesCount_( n) {}

void Graph::add_edge(int u, int v) {
    addConnection_( u, v);
    addConnection_( v, u);
}

void Graph::addConnection_( int u, int v){
    auto it = nodeOnAdjacentsMap_.find( u);
    if( it == nodeOnAdjacentsMap_.end()){
        set<int> s;
        s.insert( v);
        nodeOnAdjacentsMap_.insert( pair<int, set<int>>( u, s));
    }
    else
        it->second.insert( v);
}

vector<int> Graph::shortest_reach(int start) {
    
    set<int> visited;
    queue<pair<int,int>> nextToVisitQueue;
    nextToVisitQueue.push( pair<int,int>(start, 0));
    
    vector<int> res;
    for( int i = 0; i < nodesCount_; i++){
        res.push_back( -1);
    }
    
    while( !nextToVisitQueue.empty()){
        pair<int,int> next = nextToVisitQueue.front();
        nextToVisitQueue.pop();
        if( visited.find( next.first) != visited.end())
            continue;
        
        visited.insert( next.first);
        res[ next.first] = next.second * 6;
        
        set<int> adjacents = nodeOnAdjacentsMap_[ next.first];
        
        for( auto it = adjacents.begin(); it != adjacents.end(); it++){
            nextToVisitQueue.push( pair<int,int>(*it, next.second + 1));
        }
    }
    
    return res;
}


int main() {
    int queries;
    cin >> queries;
        
    for (int t = 0; t < queries; t++) {
      
		int n, m;
        cin >> n;
        // Create a graph of size n where each edge weight is 6: 
        Graph graph(n);
        cin >> m;
        // read and set edges
        for (int i = 0; i < m; i++) {
            int u, v;
            cin >> u >> v;
            u--, v--;
            // add each edge to the graph
            graph.add_edge(u, v);
        }
		int startId;
        cin >> startId;
        startId--;
        // Find shortest reach from node s
        vector<int> distances = graph.shortest_reach(startId);

        for (int i = 0; i < distances.size(); i++) {
            if (i != startId) {
                cout << distances[i] << " ";
            }
        }
        cout << endl;
    }
    
    return 0;
}