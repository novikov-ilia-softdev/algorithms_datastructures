#include <bits/stdc++.h>

#include <map>
using namespace std;

string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

void print( const map<int, int>& valueOnCountMap){
    for( auto it = valueOnCountMap.begin(); it != valueOnCountMap.end(); it++){
        std::cout << it->first << ": " << it->second << std::endl;
    }
    std::cout << std::endl;
}

int incValueByKey( map<int, int>& m, int key)
{
    auto iter = m.find( key);
    int res = -1;
    if( iter == m.end()){
        m.insert( pair<int, int>(key, 1));
        res = 1;
    }  
    else{
        iter->second++;
        res = iter->second;
    }
    
    return res;
        
}

void decValueByKey( map<int, int>& m, int key)
{
    auto iter = m.find( key);
    if( iter != m.end()){
        iter->second--;
        if( iter->second == 0)
            m.erase( iter);
    }
}

// Complete the freqQuery function below.
vector<int> freqQuery(vector<vector<int>> queries) {
    map<int, int> valueOnCountMap;
    map<int, int> countOnValuesMap;
    vector<int> result;
    
    for( int i = 0; i < queries.size(); i++){
        vector<int> query = queries[ i];
        int cmd = query[ 0];
        int value = query[ 1];
        
        //std::cout << "cmd: " << cmd << " " << value << std::endl;
        
        if( cmd == 1){
            int count = incValueByKey( valueOnCountMap, value);
            decValueByKey( countOnValuesMap, count - 1);
            incValueByKey( countOnValuesMap, count);
            continue;
        }
        
        if( cmd == 2){
            decValueByKey( valueOnCountMap, value);
            continue;
        }
        
        if( cmd == 3){
            auto it = countOnValuesMap.find( value);
            if( it != countOnValuesMap.end())
                result.push_back( 1);
            else
                result.push_back( 0);
            
            continue;
        }
    }
    
    return result;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string q_temp;
    getline(cin, q_temp);

    int q = stoi(ltrim(rtrim(q_temp)));

    vector<vector<int>> queries(q);

    for (int i = 0; i < q; i++) {
        queries[i].resize(2);

        string queries_row_temp_temp;
        getline(cin, queries_row_temp_temp);

        vector<string> queries_row_temp = split(rtrim(queries_row_temp_temp));

        for (int j = 0; j < 2; j++) {
            int queries_row_item = stoi(queries_row_temp[j]);

            queries[i][j] = queries_row_item;
        }
    }

    vector<int> ans = freqQuery(queries);

    for (int i = 0; i < ans.size(); i++) {
        fout << ans[i];

        if (i != ans.size() - 1) {
            fout << "\n";
        }
    }

    fout << "\n";

    fout.close();

    return 0;
}

string ltrim(const string &str) {
    string s(str);

    s.erase(
        s.begin(),
        find_if(s.begin(), s.end(), not1(ptr_fun<int, int>(isspace)))
    );

    return s;
}

string rtrim(const string &str) {
    string s(str);

    s.erase(
        find_if(s.rbegin(), s.rend(), not1(ptr_fun<int, int>(isspace))).base(),
        s.end()
    );

    return s;
}

vector<string> split(const string &str) {
    vector<string> tokens;

    string::size_type start = 0;
    string::size_type end = 0;

    while ((end = str.find(" ", start)) != string::npos) {
        tokens.push_back(str.substr(start, end - start));

        start = end + 1;
    }

    tokens.push_back(str.substr(start));

    return tokens;
}
