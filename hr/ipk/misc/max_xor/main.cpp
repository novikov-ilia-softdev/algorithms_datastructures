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
    int finalValue;
    
    Node( int val): value( val), left( NULL), right( NULL) {}
};

void insert( Node* node, int n, int count, int finalValue){
    if( count == 8 * sizeof( n)){
        node->finalValue = finalValue;
        return;
    }
    
    if( n & 1){
        if( !node->right)
            node->right = new Node( 1);

	insert( node->right, n >> 1, count + 1, finalValue);
    }   
    else{
        if( !node->left)
            node->left = new Node( 0);
        
	insert( node->left, n >> 1, count + 1, finalValue);
    }
}

int get( Node* node, int n){
    
    if( !node->left && !node->right)
        return node->finalValue;
    
    if( n & 1){
        if( node->left)
            return get( node->left, n >> 1);
        return get( node->right, n >> 1);
    }
    else{
        if( node->right)
            return get( node->right, n >> 1);
        return get( node->left, n >> 1);
    }
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
    
    static void printVector( const vector<int>& arr){
        for( auto& n : arr){
            cout << n << " ";
        }
        cout << endl;
    }
};

vector<int> maxXor(vector<int> arr, vector<int> queries) {
    
    Node* root = new Node( 2);
    for( auto& n : arr){
        //cout << endl << endl << endl << "new number" << endl;
        //DebugUtils::printBinary( n);
        insert( root, n, 0, n);
    }
    
    //cout << "printTree" << endl;
    //DebugUtils::printTree( root);
    
    
    vector<int> res;
    for( auto& query : queries){
        int maxXor = get( root, query);
        res.push_back( get( root, query) ^ query);
    }
    
    DebugUtils::printVector( arr);
    DebugUtils::printVector( queries);
    DebugUtils::printVector( res);
    
    return res;
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
