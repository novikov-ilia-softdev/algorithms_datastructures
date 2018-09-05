#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

void print( const vector<int>& v){
    for(int i = 0; i < v.size(); i++){
        cout << v[ i] << " ";
    }
    cout << endl;
}

float median( const vector<int>& v, int startIndex, int stopIndex){
    static vector<int> temp;
    
    if( temp.empty()){
        for( int i = startIndex; i <= stopIndex; i++){
            temp.push_back( v[i]);
        }
    }
    else{
        temp.erase(temp.begin());
        temp.push_back( v[stopIndex]);
    }
    
    sort( temp.begin(), temp.end());
    //print(temp);
    
    if( temp.size() % 2 == 1)
        return temp[ temp.size() / 2];
    
    return (temp[ temp.size() / 2] + temp[ temp.size() / 2 - 1]) / 2.0;
}

int activityNotifications(vector<int> expenditure, int d) {
    int result = 0;
    for( int i = d; i < expenditure.size(); i++){
       //cout << "i: " << i << " = " << expenditure[i] << endl;
       float med = median( expenditure, i - d, i - 1);
       //cout << "med: " << med << endl;
       if( expenditure[i] >= 2 * med)
           result++;
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
