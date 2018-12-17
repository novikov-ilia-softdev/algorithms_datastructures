#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

struct Point{
    Point( int x_ = 0, int y_ = 0, int steps_ = 0): x( x_), y( y_), steps( steps_) {}
    int x;
    int y;
    int steps;
    vector<Point> path;
};

bool isGoal( const Point& cur, const Point& goal){
    return ( cur.x == goal.x && cur.y == goal.y);
}

vector<Point> getNext( const Point& cur, const Point& goal, const vector<string>& grid){
    vector<Point> nexts;
    Point next( cur);
    bool needToAdd = false;
    
    // right
    next = cur;
    needToAdd = false;
    while( next.y + 1 <= grid.size() - 1 && grid[ next.x][next.y + 1] != 'X'){
        needToAdd = true;
        next.y++;
        if ( isGoal( next, goal))
            break;
    }
    
    if( needToAdd){
        next.steps++;
        next.path.push_back( cur);
        nexts.push_back( next);
    }
    
    // left
    next = cur;
    needToAdd = false;
    while( next.y - 1 >= 0 && grid[ next.x][next.y - 1] != 'X'){
        needToAdd = true;
        next.y--;
        if ( isGoal( next, goal))
            break;
    }
    
    if( needToAdd){
        next.steps++;
        next.path.push_back( cur);
        nexts.push_back( next);
    }
    
    // down
    next = cur;
    needToAdd = false;
    while( next.x + 1 <= grid.size() - 1 && grid[ next.x + 1][next.y] != 'X'){
        needToAdd = true;
        next.x++;
        if ( isGoal( next, goal))
            break;
    }
    
    if( needToAdd){
        next.steps++;
        next.path.push_back( cur);
        nexts.push_back( next);
    }
    
    // up
    next = cur;
    needToAdd = false;
    while( next.x - 1 >= 0 && grid[ next.x - 1][next.y] != 'X'){
        needToAdd = true;
        next.x--;
        if ( isGoal( next, goal))
            break;
    }
    
    if( needToAdd){
        next.steps++;
        next.path.push_back( cur);
        nexts.push_back( next);
    }
    
    return nexts;
}

void printGrid( vector<string>& grid){
    //cout << setw(3);
    for( int i = 0; i < grid.size(); i++){
        for( int j = 0; j < grid.size(); j++){
            cout << grid[i][j] << "  ";
        }
        cout << endl;
    }
}

// Complete the minimumMoves function below.
int minimumMoves(vector<string> grid, int startX, int startY, int goalX, int goalY) {
    queue<Point> q;
    
    Point start( startX, startY);
    q.push( start);
    grid[startX][startY] = 'S';
    grid[goalX][goalY] = 'F';
    
    Point goal( goalX, goalY);
    
    set<string> visited;
    
    while( !q.empty()){
        Point cur = q.front();
        q.pop();
        
        cout << "cur: " << cur.x << "," << cur.y << " - " << cur.steps << endl;
        //grid[ cur.x][cur.y] = 'P';
        string s = to_string(cur.steps);
        //grid[ cur.x][cur.y] = *(s.c_str());
        grid[ cur.x][cur.y] = 'P';
        printGrid( grid);
        cin.get();
        visited.insert( to_string( cur.x) + "_" + to_string( cur.y));
        
        if( isGoal( cur, goal)){
            //grid[cur.prevX][cur.prevY] = 'T';
            //printGrid( grid);
            return cur.steps;
        }
            
        vector<Point> nexts = getNext( cur, goal, grid);
        
        /*
        if( cur.steps < 10){
            string s = to_string(cur.steps);
            grid[ cur.x][cur.y] = *(s.c_str());
            //grid[ cur.x][cur.y] = cur.steps - 'a';
        }
        */
        
        for( int i = 0; i < nexts.size(); i++){
            if( visited.find( to_string( nexts[ i].x) + "_" + to_string( nexts[ i].y)) == visited.end())
                q.push( nexts[ i]);
        }
    }

    return -1;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input01.txt");

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
    
    cout << "result: " << result << endl;

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
