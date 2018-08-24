#include <bits/stdc++.h>

#include <algorithm>
using namespace std;

vector<string> split_string(string);

int maxSubsetSum(vector<int> arr) { 
    arr[ 1] = max(arr[0], arr[1]);
    
    vector<int> v;
    v.push_back( arr[0]);
    v.push_back( arr[2]);
    v.push_back( arr[0] + arr[2]);
    sort(v.begin(), v.end(), greater<int>());
    arr[ 2] = v[ 0];
    
    for( int i = 3; i < arr.size(); i++){
        vector<int> v;
        v.push_back( arr[i-2]);
        v.push_back( arr[i]);
        v.push_back( arr[i - 2] + arr[i]);
        v.push_back( arr[i - 3] + arr[i]);
        sort(v.begin(), v.end(), greater<int>());
        arr[ i] = v[ 0];
    }
    
    sort(arr.begin(), arr.end(), greater<int>());
    
    return arr[ 0];
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    string arr_temp_temp;
    getline(cin, arr_temp_temp);

    vector<string> arr_temp = split_string(arr_temp_temp);

    vector<int> arr(n);

    for (int i = 0; i < n; i++) {
        int arr_item = stoi(arr_temp[i]);

        arr[i] = arr_item;
    }

    int res = maxSubsetSum(arr);

    fout << res << "\n";

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
