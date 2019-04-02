#include <bits/stdc++.h>
#include <map>
using namespace std;

vector<string> split_string(string); 

/*
long getMaxOfMins( const vector<long>& arr, int windowSize){
    vector<long> mins;
    for( int i = 0; i < arr.size() && i + windowSize - 1 < arr.size(); i++){
        mins.push_back( *min_element(arr.begin() + i, arr.begin() + i + windowSize));
    }

    return *max_element( mins.begin(), mins.end());
}

vector<long> riddle(vector<long> arr) {
    vector<long> res;
    for( int i = 1; i <= arr.size(); i++){
        cout << getMaxOfMins( arr, i) << " ";
        res.push_back( getMaxOfMins( arr, i));
    }

    return res;
}
*/

int getMaxWindowSize( int i, const vector<long>& arr ){
    int left = i;
    
    while( left > 0 && arr[left - 1] >= arr[i]){
        left--;
    }
        
    int right = i;
    while( right < arr.size() - 1 && arr[right + 1] >= arr[i]){
        right++;
    }
    
    return right - left + 1;
}

typedef map<long, long> LongOnLongMap;

void fillMap( LongOnLongMap& srcMap, vector<long>& arr){
    for( int i = 0; i < arr.size(); i++){
        int val = arr[ i];
        int windowSize = getMaxWindowSize( i, arr);
        
        if( srcMap.count( val) == 0)
            srcMap[ val] = windowSize;
        else
            if( windowSize > srcMap[ val])
                srcMap[ val] = windowSize;
    }
}

void invertMap( LongOnLongMap& srcMap, LongOnLongMap& dstMap){
    for( auto it = srcMap.begin(); it != srcMap.end(); it++){
        int val = it->first;
        int winSize = it->second;
        if( dstMap.count( winSize))
            dstMap[ winSize] = val;
        else
            if( val > dstMap[ winSize])
                dstMap[ winSize] = val;
            
        // correct second map
        for( auto it = dstMap.begin(); it != dstMap.end(); it++){
            if( it->first < winSize && it->second < val)
                it->second = val;
        }
    }
}

void fillGapes( LongOnLongMap& srcMap, vector<long> arr){
    long prev = srcMap.rbegin()->second;
    for( int i = arr.size(); i > 0; i--){
        auto it = srcMap.find( i);
        if( it == srcMap.end())
            srcMap.insert( make_pair( i, prev));
        else
            prev = it->second;
            
    }
}

void createResult( LongOnLongMap& srcMap, vector<long>& vec){
    for( auto it = srcMap.begin(); it != srcMap.end(); it++){
        vec.push_back( it->second);
    }
}

vector<long> riddle(vector<long> arr) {
    
    LongOnLongMap minValueOnMaxWindowSizeMap;
    fillMap( minValueOnMaxWindowSizeMap, arr);
    
    LongOnLongMap maxWindowSizeOnMinValueMap;
    invertMap( minValueOnMaxWindowSizeMap, maxWindowSizeOnMinValueMap);
    
    fillGapes( maxWindowSizeOnMinValueMap, arr);
    
    vector<long> res;
    createResult( maxWindowSizeOnMinValueMap, res);
    
    return res;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input05.txt");

    int n;
    fin >> n;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    string arr_temp_temp;
    getline(fin, arr_temp_temp);

    vector<string> arr_temp = split_string(arr_temp_temp);

    vector<long> arr(n);

    for (int i = 0; i < n; i++) {
        long arr_item = stol(arr_temp[i]);

        arr[i] = arr_item;
    }

    vector<long> res = riddle(arr);

    for (int i = 0; i < res.size(); i++) {
        fout << res[i];

        if (i != res.size() - 1) {
            fout << " ";
        }
    }

    fout << "\n";

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
