#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

class RunningMedian{
public:
    RunningMedian( int c);
    void push( int val);
    float getMedian() const;
    int getSize() const;
    
private:
    int _capacity;
    void _rebalance();
    multiset<int, less<int>> _upper;
    multiset<int, greater<int>> _lower;
    queue<int> _q;
};

RunningMedian::RunningMedian( int c): 
    _capacity( c) {}

void RunningMedian::push( int val){
    if( getSize() == _capacity)
    {
        int valToDelete = _q.front();
        _q.pop();
        auto it1 = _upper.find( valToDelete);
        if( it1 != _upper.end())
            _upper.erase( it1);
        else{
            auto it2 = _lower.find( valToDelete);
            if( it2 != _lower.end())
                _lower.erase( it2);
        }
    }
    
    _rebalance();
    _q.push( val);
    
    if( val >= *_upper.begin())
        _upper.insert( val);
    else
        _lower.insert( val);
    
    _rebalance();
}

float RunningMedian::getMedian() const{
    if( _upper.size() == _lower.size())
        return (*_upper.begin() + *_lower.begin()) / 2.0;

    if( _upper.size() > _lower.size())
        return *_upper.begin();

    return *_lower.begin();
}

int RunningMedian::getSize() const{
    return _upper.size() + _lower.size();
}

void RunningMedian::_rebalance(){
    if( _upper.size() - _lower.size() == 2){
        _lower.insert( *_upper.begin());
        _upper.erase( _upper.begin());
        
    }
    else if( _lower.size() - _upper.size() == 2){
        _upper.insert( *_lower.begin());
        _lower.erase(_lower.begin());
    }
}

int activityNotifications(vector<int> expenditure, int d) {
    int result = 0;
    RunningMedian runningMedian( d);
    
    for( int i = 0; i < expenditure.size(); i++){
       if( runningMedian.getSize() < d){
           runningMedian.push( expenditure[i]);
           continue;
       }   
       if( expenditure[i] >= 2 * runningMedian.getMedian())
           result++;
        
       runningMedian.push( expenditure[i]);
    }
    
    return result;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string nd_temp;
    getline(cin, nd_temp);

    vector<string> nd = split_string(nd_temp);

    int n = stoi(nd[0]);

    int d = stoi(nd[1]);

    string expenditure_temp_temp;
    getline(cin, expenditure_temp_temp);

    vector<string> expenditure_temp = split_string(expenditure_temp_temp);

    vector<int> expenditure(n);

    for (int i = 0; i < n; i++) {
        int expenditure_item = stoi(expenditure_temp[i]);

        expenditure[i] = expenditure_item;
    }

    int result = activityNotifications(expenditure, d);

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
