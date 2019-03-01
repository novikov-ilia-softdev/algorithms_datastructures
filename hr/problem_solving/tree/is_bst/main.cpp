The Node struct is defined as follows:
	struct Node {
		int data;
		Node* left;
		Node* right;
	}
*/
void doDFS( Node* root, vector<int>& v){
    if( !root)
	return;
    
    doDFS( root->left, v);
    v.push_back( root->data);
    doDFS( root->right, v);
}

bool checkBST(Node* root) {
    if( !root)
	return false;

    vector<int> v;
    doDFS( root, v);

    for( int i = 0; i < v.size() - 1; i++){
	if( v[i] >= v[i + 1])
	    return false;
    }

    return true;
}