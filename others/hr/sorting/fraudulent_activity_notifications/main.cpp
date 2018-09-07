#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

void push( multiset<int, less<int>>& upper,
           multiset<int, greater<int>>& lower,
           int val, int capacity){
    
    static queue<int> q;
    
    if( upper.size() + lower.size() == capacity)
    {
        int valToDelete = q.front();
        q.pop();
        auto it1 = upper.find( valToDelete);
        if( it1 != upper.end())
            upper.erase( it1);
        else{
            auto it2 = lower.find( valToDelete);
            if( it2 != lower.end())
                lower.erase( it2);
        }
    }
    
    // rebalance
    if( upper.size() - lower.size() == 2){
        lower.insert( *upper.begin());
        upper.erase( upper.begin());
        
    }
    else if( lower.size() - upper.size() == 2){
        upper.insert( *lower.begin());
        lower.erase(lower.begin());
    }
    
    q.push( val);
    
    // push
    if( val >= *upper.begin())
        upper.insert( val);
    else
        lower.insert( val);
    
    
    // rebalance
    if( upper.size() - lower.size() == 2){
        lower.insert( *upper.begin());
        upper.erase( upper.begin());
        
    }
    else if( lower.size() - upper.size() == 2){
        upper.insert( *lower.begin());
        lower.erase(lower.begin());
    }
}

float median( multiset<int, less<int>>& upper,
              multiset<int, greater<int>>& lower){

    if( upper.size() == lower.size())
        return (*upper.begin() + *lower.begin()) / 2.0;
    
    if( upper.size() > lower.size())
        return *upper.begin();
    
    return *lower.begin();
}

int activityNotifications(vector<int> expenditure, int d) {
    int result = 0;
    multiset<int, less<int>> upper;
    multiset<int, greater<int>> lower;
    
    for( int i = 0; i < expenditure.size(); i++){
       if( lower.size() + upper.size() < d){
           push( upper, lower, expenditure[i], d);
           continue;
       }   
       if( expenditure[i] >= 2 * median( upper, lower))
           result++;
        
       push( upper, lower, expenditure[i], d);
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
