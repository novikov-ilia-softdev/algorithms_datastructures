#include <bits/stdc++.h>

using namespace std;

void doDFS( const vector<vector<int>>& grid, int i, int j, set<string>& visited, int& curRegion)
{
    if( i < 0 || i >= grid.size())
        return;
    
    if( j < 0 || j >= grid[i].size())
        return;
    
    if( visited.find( to_string(i) + "_" + to_string(j)) != visited.end())
        return;
    
    visited.insert( to_string(i) + "_" + to_string(j));
    
    if( grid[i][j] == 1){
        curRegion++;
        
        doDFS( grid, i - 1, j - 1   , visited, curRegion);
        doDFS( grid, i - 1, j       , visited, curRegion);
        doDFS( grid, i - 1, j + 1   , visited, curRegion);
        doDFS( grid, i,     j - 1   , visited, curRegion);
        doDFS( grid, i,     j + 1   , visited, curRegion);
        doDFS( grid, i + 1, j - 1   , visited, curRegion);
        doDFS( grid, i + 1, j       , visited, curRegion);
        doDFS( grid, i + 1, j + 1   , visited, curRegion);
    }
}

int maxRegion(vector<vector<int>> grid) {
    int max = 0;
    
    set<string> visited;
    
    for( int i = 0; i < grid.size(); i++){
        for( int j = 0; j < grid[i].size(); j++){
            if( visited.find( to_string(i) + "_" + to_string(j)) == visited.end() &&
                grid[i][j] == 1){
                int curRegion = 0;
                doDFS( grid, i, j, visited, curRegion);
                if( curRegion > max)
                    max = curRegion;
            }
        }
    }
    
    return max;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    int m;
    cin >> m;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<vector<int>> grid(n);
    for (int i = 0; i < n; i++) {
        grid[i].resize(m);

        for (int j = 0; j < m; j++) {
            cin >> grid[i][j];
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    int res = maxRegion(grid);

    fout << res << "\n";

    fout.close();

    return 0;
}
