#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

struct Point{
    Point( int x_, int y_, int steps_ = 0): x( x_), y( y_), steps( steps_) {}
    int x;
    int y;
    int steps;
}

bool isGoal( const Point& cur, const Point& goal){
    return ( cur.x == goal.x && cur.y == goal.y);
}

vector<Point> getNext( const Point& cur, const vector<string>& grid){
    // TODO: add visited map
    
    
}

// Complete the minimumMoves function below.
int minimumMoves(vector<string> grid, int startX, int startY, int goalX, int goalY) {
    queue<Point> q;
    
    Point start( startX, startY);
    q.push( start);
    
    Point goal( goalX, goalY);
    
    while( !q.empty()){
        Point cur = q.front();
        q.pop();
        
        if( isGoal( cur, goal))
            return cur.steps;

        vector<Point> nexts = getNext( cur, grid);

        for( int i = 0; i < nexts.size(); i++){
            q.push( nexts[ i]);
        }
    }
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<string> grid(n);

    for (int i = 0; i < n; i++) {
        string grid_item;
        getline(cin, grid_item);

        grid[i] = grid_item;
    }

    string startXStartY_temp;
    getline(cin, startXStartY_temp);

    vector<string> startXStartY = split_string(startXStartY_temp);

    int startX = stoi(startXStartY[0]);

    int startY = stoi(startXStartY[1]);

    int goalX = stoi(startXStartY[2]);

    int goalY = stoi(startXStartY[3]);

    int result = minimumMoves(grid, startX, startY, goalX, goalY);

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
