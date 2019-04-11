#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

/*
// Brute force
vector<int> maxXor(vector<int> arr, vector<int> queries) {
    vector<int> res;
    for( int i = 0; i < queries.size(); i++){
        int maxXor = queries[ i] ^ arr[0];
        
        for( int j = 1; j < arr.size(); j++){
            int curXor = queries[ i] ^ arr[j];
            if( curXor > maxXor)
                maxXor = curXor;
        }
        
        res.push_back( maxXor);
    }
    
    return res;
}
*/

// TODO
// create trie
// make search of inversion


struct Node{
    int value;
    Node* left;
    Node* right;
    
    Node( int val): value( val) {}
};

Node* insert( Node* node, int n, int count){
    cout << "insert" << endl;
    cout << "n: " << n << endl;
    cout << "count: " << count << endl;
    cin.get();
    
    if( count == 8 * sizeof( n)){
        cout << "count" << endl;
        return node;
    }
        
    
    if( !node){
        cout << "!node" << endl;
        node = new Node( n & 1);
        return node;
    }
    
    if( count > 1){
        cout << "shift" << endl;
        n = n >> 1;
    }
        
    
    if( n & 1){
        cout << "right" << endl;
        node->right = insert( node->right, n, count + 1);
    }
        
    else{
        cout << "left" << endl;
        node->left = insert( node->left, n, count + 1);
    }
        
    cout << "return node" << endl;
        
    return node;
}

class DebugUtils{
public:
    static void printBinary( int n){
        for( int i = 0; i < 8 * sizeof( n); i++){
            //cout << i;
            cout << (n & 1);
            n = n >> 1;
        }
        cout << endl;
    }
    
    static void printTree( Node* node){
        if( !node)
            return;
        
        printTree( node->left);
        cout << node->value << " ";
        printTree( node->right);
    }
};

vector<int> maxXor(vector<int> arr, vector<int> queries) {
    
    Node* root = new Node( 2);
    for( auto& n : arr){
        cout << endl << endl << endl << "new number" << endl;
        DebugUtils::printBinary( n);
        insert( root, n, 1);
    }
    
    //cout << "printTree" << endl;
    //DebugUtils::printTree( root);
    
    /*
    DebugUtils::printTrie( trie);
    
    vector<int> res;
    for( auto& query : queries){
        res.push_back( trie.get( query));
    }
    
    return res;
    */
    
    return arr;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input00.txt");

    int n;
    fin >> n;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    string arr_temp_temp;
    getline(fin, arr_temp_temp);

    vector<string> arr_temp = split_string(arr_temp_temp);

    vector<int> arr(n);

    for (int i = 0; i < n; i++) {
        int arr_item = stoi(arr_temp[i]);

        arr[i] = arr_item;
    }

    int m;
    fin >> m;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<int> queries(m);

    for (int i = 0; i < m; i++) {
        int queries_item;
        fin >> queries_item;
        fin.ignore(numeric_limits<streamsize>::max(), '\n');

        queries[i] = queries_item;
    }

    vector<int> result = maxXor(arr, queries);

    for (int i = 0; i < result.size(); i++) {
        fout << result[i];

        if (i != result.size() - 1) {
            fout << "\n";
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
