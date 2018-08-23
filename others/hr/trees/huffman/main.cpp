/* 
The structure of the node is

typedef struct node {

	int freq;
    char data;
    node * left;
    node * right;
    
} node;

*/

void decode_str(node * root, node * n, const string& s, string& res) {
    if( n->data){
        res += n->data;
        decode_str( root, root, s, res);
        return;
    }
    
    if( s == ""){
        return;
    }
    
    if( s[ 0] == '0'){
        decode_str( root, n->left, s.substr(1), res);
        return;
    }
    
    if( s[ 0] == '1'){
        decode_str( root, n->right, s.substr(1), res);
        return;
    }
}

void decode_huff(node * root, string s) {
    std::string res = "";
    decode_str( root, root, s, res);
    std::cout << res << std::endl;
}
