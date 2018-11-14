#include <bits/stdc++.h>

using namespace std;

string timeConversion(string s) {
    bool isAM = false;
    if( s.find( "AM") != string::npos)
        isAM = true;
    
    int hours = stoi(s.substr(0,2));
    
    string result = s.substr(0,8);
    if( isAM && hours == 12){
        result[ 0] = '0';
        result[ 1] = '0';
        return result;
    }
    
    if( !isAM && hours != 12){
        string hoursStr = to_string(hours + 12);
        result[ 0] = hoursStr[0];
        result[ 1] = hoursStr[1];
        return result;
    }
        
    return result;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string s;
    getline(cin, s);

    string result = timeConversion(s);

    fout << result << "\n";

    fout.close();

    return 0;
}
