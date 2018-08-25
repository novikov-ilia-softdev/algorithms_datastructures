#include <bits/stdc++.h>

#include <algorithm>
using namespace std;

vector<string> split_string(string);

// Complete the findShortest function below.

/*
 * For the unweighted graph, <name>:
 *
 * 1. The number of nodes is <name>_nodes.
 * 2. The number of edges is <name>_edges.
 * 3. An edge exists between <name>_from[i] to <name>_to[i].
 *
 */

bool findPath( int graph_nodes,
               vector<int> graph_from, vector<int> graph_to,
               int node_from, int node_to,
               int& length){
    
    std::cout << "findPath: " << node_from << ", " << node_to << std::endl;
    
    for( int i = 0; i < graph_from.size(); i++){
        if( graph_from[ i] == node_from && graph_to[ i] == node_to ||
            graph_from[ i] == node_to && graph_to[ i] == node_from
          )
        {
            length++;
            return true;
        }
        
        if( node_from == graph_from[ i] || node_to == graph_from[ i]){
            vector<int> new_graph_from;
            vector<int> new_graph_to;
            for( int j = 0; j < graph_from.size(); j++)
            {
                if( i != j){
                    new_graph_from.push_back( graph_from[ j]);
                    new_graph_to.push_back( graph_to[ j]);
                }
            }
            
            length++;
            return findPath( graph_nodes,
                             new_graph_from, new_graph_to,
                             node_from, node_to,
                             length);
        }
    }
    
    return false;
    /*
    if( edges.empty())
        return false;
    
    vector<int> new_graph_from;
    vector<int> new_graph_to;
    
    for( int i = 0; i < edges.size(); i++){
        if( edges[ i] != graph_from[ i]){
            new_graph_from.push_back( edges[ i]);
            new_graph_to.push_back( edges[ i]);
        }
        
    }
    
    length++;
    
    return findPath( graph_nodes,
                     graph_from, graph_to,
                     node_from, node_to,
                     length);
    */
}

int getPath( int graph_nodes,
             vector<int> graph_from, vector<int> graph_to,
             int node_from, int node_to){
    std::cout << "getPath: " << node_from << ", " << node_to << std::endl;
    int length = 0;
    bool found = findPath( graph_nodes,
                           graph_from, graph_to,
                           node_from, node_to,
                           length);
    
    if( found){
        std::cout << "found! length ==  " << length << std::endl;
        return length;
    }
        
    std::cout << "not found!" << std::endl;
    
    return -1;
}

int findShortest(int graph_nodes,
                 vector<int> graph_from, vector<int> graph_to,
                 vector<long> ids, int val) {
    vector<int> coloredNodes;
    
    for( int i = 0; i < ids.size(); i++){
        if( ids[ i] == val)
            coloredNodes.push_back( i + 1);
    }
    
    if( coloredNodes.size() < 2)
        return -1;
    
    vector<int> paths;
    
    for( int i = 0; i < coloredNodes.size() - 1; i++)
    {
        for( int j = i + 1; j < coloredNodes.size(); j++)
        {
            paths.push_back( getPath( graph_nodes, graph_from, graph_to, coloredNodes[ i], coloredNodes[ j]));
        }
    }
    
    sort( paths.begin(), paths.end());
    
    return paths[ 0];
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int graph_nodes;
    int graph_edges;

    cin >> graph_nodes >> graph_edges;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<int> graph_from(graph_edges);
    vector<int> graph_to(graph_edges);

    for (int i = 0; i < graph_edges; i++) {
        cin >> graph_from[i] >> graph_to[i];
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    string ids_temp_temp;
    getline(cin, ids_temp_temp);

    vector<string> ids_temp = split_string(ids_temp_temp);

    vector<long> ids(graph_nodes);

    for (int i = 0; i < graph_nodes; i++) {
        long ids_item = stol(ids_temp[i]);

        ids[i] = ids_item;
    }

    int val;
    cin >> val;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    int ans = findShortest(graph_nodes, graph_from, graph_to, ids, val);

    fout << ans << "\n";

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
