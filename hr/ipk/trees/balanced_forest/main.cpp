#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

// Complete the balancedForest function below.
int balancedForest(vector<int> c, vector<vector<int>> edges) {
    
    return 0;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input00.txt");

    int q;
    fin >> q;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int q_itr = 0; q_itr < q; q_itr++) {
        int n;
        fin >> n;
        fin.ignore(numeric_limits<streamsize>::max(), '\n');

        string c_temp_temp;
        getline(fin, c_temp_temp);

        vector<string> c_temp = split_string(c_temp_temp);

        vector<int> c(n);

        for (int i = 0; i < n; i++) {
            int c_item = stoi(c_temp[i]);

            c[i] = c_item;
        }

        vector<vector<int>> edges(n - 1);
        for (int i = 0; i < n - 1; i++) {
            edges[i].resize(2);

            for (int j = 0; j < 2; j++) {
                fin >> edges[i][j];
            }

            fin.ignore(numeric_limits<streamsize>::max(), '\n');
        }

        int result = balancedForest(c, edges);

        fout << result << "\n";
    }

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
