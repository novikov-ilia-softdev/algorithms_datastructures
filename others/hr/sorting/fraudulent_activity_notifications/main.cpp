#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

void push( priority_queue<int, vector<int>, greater<int>>& upper,
           priority_queue<int, vector<int>, less<int>>& lower,
           int val){
    
    // push
    if( val >= upper.top())
        upper.push( val);
    else
        lower.push( val);
    
    // rebalance
    if( upper.size() - lower.size() == 2){
        lower.push( upper.top());
        upper.pop();
    }
    else if( lower.size() - upper.size() == 2){
        upper.push( lower.top());
        lower.pop();
    }
}

float median( priority_queue<int, vector<int>, greater<int>>& upper,
              priority_queue<int, vector<int>, less<int>>& lower){

    if( upper.size() == lower.size())
        return (upper.top() + lower.top()) / 2.0;
    if( upper.size() > lower.size())
        return upper.top();
    return lower.top();
}

int activityNotifications(vector<int> expenditure, int d) {
    int result = 0;
    
    priority_queue<int, vector<int>, greater<int>> upper;
    priority_queue<int, vector<int>, less<int>> lower;
    upper.push( numeric_limits<int>::max());
    lower.push( numeric_limits<int>::min());
    
    for( int i = 0; i < expenditure.size(); i++){
       cout << endl << "i: " << i << " = " << expenditure[i] << endl;
        
       if( lower.size() + upper.size() < d + 2){
           cout << "continue" << endl;
           push( upper, lower, expenditure[i]);
           continue;
       }
            
       float med = median( upper, lower);
       cout << "med: " << med << endl;
           
       if( expenditure[i] >= 2 * med)
           result++;
        
       push( upper, lower, expenditure[i]);
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
