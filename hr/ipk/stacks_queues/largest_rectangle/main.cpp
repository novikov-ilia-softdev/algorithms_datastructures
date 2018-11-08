#include <bits/stdc++.h>

#include <stack>
#include <algorithm>
using namespace std;

vector<string> split_string(string);

struct Info{
    Info( int i, int h): index( i), height( h) {}
    int index;
    int height;
};

// Complete the largestRectangle function below.
long largestRectangle(vector<int> h) {
    stack<Info> st;
    int maxRect = 0;
    st.push( Info( 0, h[ 0]));
    
    for( int i = 1; i < h.size(); i++)
    {        
        Info active = st.top();
        
        if( h[i] > active.height)
        {
            st.push( Info( i, h[ i]));
            continue;
        }
    
        if( h[i] < active.height)
        {   
            Info prevActive = active;
            while( !st.empty() && h[i] < active.height)
            {
                int rect = active.height * (i - active.index);
                if( rect > maxRect)
                    maxRect = rect;
                
                prevActive = active;
                st.pop();
                if( !st.empty())
                    active = st.top();
            }
            
            st.push( Info( prevActive.index, h[ i]));
            
            continue;
        }
    }

    while( !st.empty()){
        Info active = st.top();
        int rect = active.height * (h.size() - active.index);
        if( rect > maxRect)
            maxRect = rect;
        
        st.pop();
    }
    
    return maxRect;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    string h_temp_temp;
    getline(cin, h_temp_temp);

    vector<string> h_temp = split_string(h_temp_temp);

    vector<int> h(n);

    for (int i = 0; i < n; i++) {
        int h_item = stoi(h_temp[i]);

        h[i] = h_item;
    }

    long result = largestRectangle(h);

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
