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

bool recursiveFindPath( int graph_nodes,
               const vector<int>& graph_from, const vector<int>& graph_to,
               int node_from, int node_to,
               int& length){
    
    int edges_count = graph_from.size();
    
    for( int i = 0; i < edges_count; i++){
        if( graph_from[ i] == node_from && graph_to[ i] == node_to ||
            graph_to[ i] == node_from && graph_from[ i] == node_to)
        {
            length++;
            return true;
        }
    }
    
    length++;
    for( int i = 0; i < edges_count; i++){
        int new_node_from = -1;
        if( graph_from[ i] == node_from)
            new_node_from = graph_to[ i];
        
        if( graph_to[ i] == node_from)
             new_node_from = graph_from[ i];
        
        if( new_node_from != -1)
        {
            vector<int> new_graph_from = graph_from;
            vector<int> new_graph_to = graph_to;
            new_graph_from.erase(new_graph_from.begin() + i);
            new_graph_to.erase(new_graph_to.begin() + i);
            
            bool found = recursiveFindPath( graph_nodes,
                                   new_graph_from, new_graph_to,
                                   new_node_from, node_to,
                                   length);
    
            if( found)
                return true;
        }
    }
    
    return false;
}

int getPathLength( int graph_nodes,
             const vector<int>& graph_from, const vector<int>& graph_to,
             int node_from, int node_to){
    int length = 0;
    bool found = recursiveFindPath( graph_nodes,
                           graph_from, graph_to,
                           node_from, node_to,
                           length);
    
    if( found){
        return length;
    }
    
    return -1;
}

int findShortest(int graph_nodes,
                 const vector<int>& graph_from, const vector<int>& graph_to,
                 const vector<long>& ids, int val) {
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
            paths.push_back( getPathLength( graph_nodes,
                                      graph_from, graph_to,
                                      coloredNodes[ i], coloredNodes[ j]));
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
