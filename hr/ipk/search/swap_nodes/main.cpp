#include <bits/stdc++.h>

using namespace std;

const int LEFT = 0;
const int RIGHT = 1;

void inOrderTraverse( const vector<vector<int>>& indexes,
                      int node,
                      int curDepth,
                      vector<int>& result) {
    if( node == -1)
        return;
    
    inOrderTraverse( indexes, indexes[node - 1][ LEFT], curDepth + 1, result);
    result.push_back( node);
    inOrderTraverse( indexes, indexes[node - 1][ RIGHT], curDepth + 1, result);
}

void swapRecursive( vector<vector<int>>& indexes,
                      int node,
                      int curDepth,
                      int swapDepth) {
    
    if( node == -1)
        return;
    
    swapRecursive( indexes, indexes[node - 1][ LEFT], curDepth + 1, swapDepth);
    swapRecursive( indexes, indexes[node - 1][ RIGHT], curDepth + 1, swapDepth);
    if( curDepth % swapDepth == 0){
        int temp = indexes[node - 1][ LEFT];
        indexes[node - 1][ LEFT] = indexes[node - 1][ RIGHT];
        indexes[node - 1][ RIGHT] = temp;
    }
}

vector<vector<int>> swapNodes(vector<vector<int>> indexes, vector<int> queries) {
    vector<vector<int>> results;
    for( int i = 0; i < queries.size(); i++){
        swapRecursive( indexes, 1, 1, queries[i]);
        vector<int> result;
        inOrderTraverse( indexes, 1, 1, result);
        results.push_back( result);
    }
    
    return results;
}


int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<vector<int>> indexes(n);
    for (int indexes_row_itr = 0; indexes_row_itr < n; indexes_row_itr++) {
        indexes[indexes_row_itr].resize(2);

        for (int indexes_column_itr = 0; indexes_column_itr < 2; indexes_column_itr++) {
            cin >> indexes[indexes_row_itr][indexes_column_itr];
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    int queries_count;
    cin >> queries_count;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<int> queries(queries_count);

    for (int queries_itr = 0; queries_itr < queries_count; queries_itr++) {
        int queries_item;
        cin >> queries_item;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        queries[queries_itr] = queries_item;
    }

    vector<vector<int>> result = swapNodes(indexes, queries);

    for (int result_row_itr = 0; result_row_itr < result.size(); result_row_itr++) {
        for (int result_column_itr = 0; result_column_itr < result[result_row_itr].size(); result_column_itr++) {
            fout << result[result_row_itr][result_column_itr];

            if (result_column_itr != result[result_row_itr].size() - 1) {
                fout << " ";
            }
        }

        if (result_row_itr != result.size() - 1) {
            fout << "\n";
        }
    }

    fout << "\n";

    fout.close();

    return 0;
}
