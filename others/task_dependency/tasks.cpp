struct Task {
    string name;
    int time;
    set<Task*> dependencies;
};

void doDFS( Task* task, set<Task*>& visited, int& totalTime){
    auto it = visited.find( task);
    if( it != visited.end())
        return;
        
    visited.insert( task);
    totalTime += task->time;
    for( auto next : task->dependencies){
        doDFS( next, visited, totalTime);
    }
    
    cout << task->name << endl;
}

int getTime( string name, map<string, Task*>& tasks){
    auto it = tasks.find( name);
    if( it == tasks.end())
        return -1;
        
    int totalTime = 0;
    
    set<Task*> visited;
    
    doDFS( it->second, visited, totalTime);
    
    return totalTime;
}

