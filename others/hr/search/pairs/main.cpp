#include <bits/stdc++.h>

#include <algorithm>
using namespace std;

vector<string> split_string(string);

int pairs(int k, vector<int> arr) {
    int count = 0;
    sort( arr.begin(), arr.end());
    
    int less = 0;
    int big = 1;
    
    while( big != arr.size() - 1)
    {
        int diff = arr[big] - arr[less];
        
        if( diff == k){
            count++;
            less++;
            big++;
            continue;
        }
        
        if( diff < k){
            if( big - less == 1){
                big++;
                continue;
            }
            
            big++;
            continue;
        }
        
        if( diff > k){
            if( big - less == 1){
                less++;
                big++;
                continue;
            }
            
            less++;
            continue;
        }
    }
    
    while( less != arr.size() - 1){
        int diff = arr[big] - arr[less];
        if( diff == k){
            count++;
            break;
        }
        less++;
    }
    
    return count;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string nk_temp;
    getline(cin, nk_temp);

    vector<string> nk = split_string(nk_temp);

    int n = stoi(nk[0]);

    int k = stoi(nk[1]);

    string arr_temp_temp;
    getline(cin, arr_temp_temp);

    vector<string> arr_temp = split_string(arr_temp_temp);

    vector<int> arr(n);

    for (int i = 0; i < n; i++) {
        int arr_item = stoi(arr_temp[i]);

        arr[i] = arr_item;
    }

    int result = pairs(k, arr);

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
