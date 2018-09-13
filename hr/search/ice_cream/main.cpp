#include <bits/stdc++.h>

#include <map>
using namespace std;

vector<string> split_string(string);

void whatFlavors(vector<int> cost, int money) {
    map<int, vector<int>> valueOnIndexesMap;
    for( int i = 0; i < cost.size(); i++){
        auto it = valueOnIndexesMap.find( cost[ i]);
        if( it == valueOnIndexesMap.end()){
            vector<int> indexes;
            indexes.push_back( i);
            valueOnIndexesMap.insert( pair<int, vector<int>>(cost[ i],indexes));
        }
        else{
            it->second.push_back( i);
        }
    }
    
    for( auto it = valueOnIndexesMap.begin(); it != valueOnIndexesMap.end(); it++){
        auto search = valueOnIndexesMap.find( money - it->first);
        if( search == valueOnIndexesMap.end())
            continue;
            
        vector<int> ind;
        ind.push_back( (it->second)[0] + 1);
        
        if( search->second.size() == 1)
            ind.push_back( (search->second)[0] + 1);
        
        if( search->second.size() > 1)
            ind.push_back( (search->second)[1] + 1);
        
        sort( ind.begin(), ind.end());
        std::cout << ind[0] << " " << ind[1] << std::endl;
        return;
    }
}

int main()
{
    int t;
    cin >> t;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int t_itr = 0; t_itr < t; t_itr++) {
        int money;
        cin >> money;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        int n;
        cin >> n;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        string cost_temp_temp;
        getline(cin, cost_temp_temp);

        vector<string> cost_temp = split_string(cost_temp_temp);

        vector<int> cost(n);

        for (int i = 0; i < n; i++) {
            int cost_item = stoi(cost_temp[i]);

            cost[i] = cost_item;
        }

        whatFlavors(cost, money);
    }

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
