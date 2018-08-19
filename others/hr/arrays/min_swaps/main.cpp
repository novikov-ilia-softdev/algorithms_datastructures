#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

#include<algorithm>

void print(const vector<int>& arr)
{
    for( int i = 0; i < arr.size(); i++)
    {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

// Complete the minimumSwaps function below.
int minimumSwaps(vector<int> arr) {
    // value, index
    vector<pair<int, int>> indexes;
    
    for( int i = 0; i < arr.size(); i++)
    {
        indexes.push_back( pair<int, int> (arr[i], i));
    }
    sort( indexes.begin(), indexes.end());
    
    vector<bool> visited;
    for( int i = 0; i < arr.size(); i++)
    {
        visited.push_back( 0);
    }

    int res = 0;
    for( int i = 0; i < indexes.size(); i++)
    {
        int cur = i;
        if( !visited[i]){
            vector<int> cicle;
            while( !visited[i])
            {
                cicle.push_back( cur);
                int next = indexes[ cur].second;
                visited[next] = true;
                cur = next;
            }
            res += cicle.size() - 1;
        }
    }
    
    return res;
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

    int res = minimumSwaps(arr);

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
