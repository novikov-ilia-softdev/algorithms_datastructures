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

void printFirstMap( const map<long, int>& m){
    for( auto it = m.begin(); it != m.end(); it++){
        cout << it->first << ": " << it->second << endl;
    }
}

void printSecondMap( const map<int, long>& m){
    for( auto it = m.begin(); it != m.end(); it++){
        cout << it->first << ": " << it->second << endl;
    }
}

vector<long> riddle(vector<long> arr) {
    vector<long> res;
    
    map<long, int> firstMap;
    
    for( int i = 0; i < arr.size(); i++){
        int windowSize = getMaxWindowSize( i, arr);
        auto it = firstMap.find( arr[i]);
        
        if( it == firstMap.end())
            firstMap.insert(make_pair( arr[i], windowSize));
        else
            if( windowSize > it->second)
                it->second = windowSize;
        
    }
    
    //printFirstMap( firstMap);
    //cout << endl;
    
    map<int, long> secondMap;
    for( auto firstIt = firstMap.begin(); firstIt != firstMap.end(); firstIt++){
        auto secondIt = secondMap.find( firstIt->second);
        if( secondIt == secondMap.end())
            secondMap.insert(make_pair( firstIt->second, firstIt->first));
        else
            if( firstIt->first > secondIt->second)
                secondIt->second = firstIt->first;
    }
    
    //printSecondMap( secondMap);
    //cout << endl;
    
    long prev = secondMap.rbegin()->second;
    //cout << "prev: " << prev << endl;
    for( int i = arr.size(); i > 0; i--){
        //cout << i << endl;
        auto secondIt = secondMap.find( i);
        if( secondIt == secondMap.end()){
            //cout << "inserting" << endl;
            secondMap.insert( make_pair( i, prev));
        }
            
        else{
            //cout << "update prev" << endl;
            prev = secondIt->second;
        }
            
    }
    
    //printSecondMap( secondMap);
    //cout << endl;
    
    for( auto it = secondMap.begin(); it != secondMap.end(); it++){
        res.push_back( it->second);
    }
    
    return res;
}


int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input02.txt");

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
