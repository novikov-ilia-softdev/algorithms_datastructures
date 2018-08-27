#include <bits/stdc++.h>

using namespace std;

string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

long countTriplets(vector<long> arr, long r) {
    // expect -> count
    map <long, int> thirdMap;
    map <long, int> secondMap;
    map <long, int> firstMap;
    
    long tripletsCount = 0;
    
    for( int i = 0; i < arr.size(); i++){
        
        auto third = thirdMap.find( arr[ i]);
        if( third != thirdMap.end())
            tripletsCount += it->second;
        
        auto second = secondMap.find( arr[ i]);
        if( second != secondMap.end()){
            long thirdExpectedValue = arr[i] * r;
            auto third = thirdMap.find( thirdExpectedValue);
            if( third != thirdMap.end())
                third->second += second->second;
            else
                thirdMap.insert( pair<long, int>(thirdExpectedValue, second->second));
            
            second->second++;
        }
        else
            secondMap.insert( pair<long, int>(secondExpectedValue, 1));
    
    return tripletsCount;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string nr_temp;
    getline(cin, nr_temp);

    vector<string> nr = split(rtrim(nr_temp));

    int n = stoi(nr[0]);

    long r = stol(nr[1]);

    string arr_temp_temp;
    getline(cin, arr_temp_temp);

    vector<string> arr_temp = split(rtrim(arr_temp_temp));

    vector<long> arr(n);

    for (int i = 0; i < n; i++) {
        long arr_item = stol(arr_temp[i]);

        arr[i] = arr_item;
    }

    long ans = countTriplets(arr, r);

    fout << ans << "\n";

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
