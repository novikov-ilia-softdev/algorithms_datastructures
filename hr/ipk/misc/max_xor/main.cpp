#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);


// Brute force
/*
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

struct Node{
    int value;
    Node* left;
    Node* right;
    int finalValue;
    
    Node( int val): value( val), left( NULL), right( NULL) {}
};

const int GET_HIGH_BIT_MASK = 2147483648;

void insertInBinaryTrie( Node* node, int n, int level, int finalValue){

    if( level == 8 * sizeof( n)){
        node->finalValue = finalValue;
        return;
    }
    
    if( n & GET_HIGH_BIT_MASK){
        if( !node->right)
            node->right = new Node( 1);

	insertInBinaryTrie( node->right, n << 1, level + 1, finalValue);
    }   
    else{
        if( !node->left)
            node->left = new Node( 0);
        
	insertInBinaryTrie( node->left, n << 1, level + 1, finalValue);
    }
}

int getPartnerForMaxXor( Node* node, int n){
    
    if( !node->left && !node->right)
	return node->finalValue;
        
    if( n & GET_HIGH_BIT_MASK){
        if( node->left)
	    return getPartnerForMaxXor( node->left, n << 1);
	
        return getPartnerForMaxXor( node->right, n << 1);
    }
    else{
        if( node->right)
            return getPartnerForMaxXor( node->right, n << 1);

        return getPartnerForMaxXor( node->left, n << 1);
    }
}

vector<int> maxXor(vector<int> arr, vector<int> queries) {
    
    Node* root = new Node( 2);
    for( auto& n : arr){
        insertInBinaryTrie( root, n, 0, n);
    }
    
    vector<int> res;
    for( auto& query : queries){
        res.push_back( getPartnerForMaxXor( root, query) ^ query);
    }
    
    return res;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input03.txt");

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
