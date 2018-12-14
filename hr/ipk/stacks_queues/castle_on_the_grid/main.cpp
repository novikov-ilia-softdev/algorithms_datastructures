#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

struct Point{
    Point( int x_, int y_, int steps_ = 0): x( x_), y( y_), steps( steps_) {}
    int x;
    int y;
    int steps;
};

bool isGoal( const Point& cur, const Point& goal){
    return ( cur.x == goal.x && cur.y == goal.y);
}

void addNext( Point point, vector<Point>& nexts, set<string>& visited){
    if( visited.find( to_string( point.x) + "_" + to_string( point.y)) == visited.end()){
        visited.insert( to_string( point.x) + "_" + to_string( point.y));
        nexts.push_back( point);
    }
}

vector<Point> getNext( const Point& cur, const Point& goal, const vector<string>& grid, set<string>& visited){
    vector<Point> nexts;
    
    // right
    if( cur.y != grid.size() - 1){
        int right = cur.y;
        while( right + 1 < grid.size() &&
               grid[ cur.x][right + 1] != 'X'){
            
            right++;
            if (cur.x == goal.x && right == goal.y)
                break;
        }
        
        Point rightNext( cur.x, right, cur.steps + 1);
        addNext( rightNext, nexts, visited);
    }
    
    // left
    if( cur.y != 0){
        int left = cur.y;
        while( left - 1 >= 0 &&
               grid[ cur.x][left - 1] != 'X'){

            left--;
            if(cur.x == goal.x && left == goal.y)
                break;
        }
        
        Point leftNext( cur.x, left, cur.steps + 1);
        addNext( leftNext, nexts, visited);
    }
    
    // down
    if( cur.x != grid.size() - 1){
        int down = cur.x;
        while( down + 1 < grid.size() &&
               grid[ down + 1][cur.y] != 'X'){
            
            down++;
            if(down == goal.x && cur.y == goal.y)
                break;
        }
        
        Point downNext( down, cur.y, cur.steps + 1);
        addNext( downNext, nexts, visited);
    }
    
    // up
    if( cur.x != 0){
        int up = cur.x;
        while( up - 1 >= 0 &&
               grid[ up - 1][cur.y] != 'X'){
            
            up--;
            if(up == goal.x && cur.y == goal.y)
                break;
        }
        
        Point upNext( up, cur.y, cur.steps + 1);
        addNext( upNext, nexts, visited);
    }
    
    return nexts;
}

// Complete the minimumMoves function below.
int minimumMoves(vector<string> grid, int startX, int startY, int goalX, int goalY) {
    queue<Point> q;
    
    Point start( startX, startY);
    q.push( start);
    
    Point goal( goalX, goalY);
    
    set<string> visited;
    visited.insert( to_string( start.x) + "_" + to_string( start.y));
    
    while( !q.empty()){
        Point cur = q.front();
        q.pop();
        
        //cout << "next: " << cur.x << "," << cur.y << endl;
        
        if( isGoal( cur, goal))
            return cur.steps;

        vector<Point> nexts = getNext( cur, goal, grid, visited);

        for( int i = 0; i < nexts.size(); i++){
            q.push( nexts[ i]);
        }
    }

    return -1;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input10.txt");

    int n;
    fin >> n;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<string> grid(n);

    for (int i = 0; i < n; i++) {
        string grid_item;
        getline(fin, grid_item);

        grid[i] = grid_item;
    }

    string startXStartY_temp;
    getline(fin, startXStartY_temp);

    vector<string> startXStartY = split_string(startXStartY_temp);

    int startX = stoi(startXStartY[0]);

    int startY = stoi(startXStartY[1]);

    int goalX = stoi(startXStartY[2]);

    int goalY = stoi(startXStartY[3]);

    int result = minimumMoves(grid, startX, startY, goalX, goalY);
    
    //cout << "result: " << result << endl;

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
