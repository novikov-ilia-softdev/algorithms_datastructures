/*
The Node struct is defined as follows:
	struct Node {
		int data;
		Node* left;
		Node* right;
	}
*/

// 1. More readable
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

// 2. More efficient
bool doDFS( Node* root, vector<int>& v){        
    if( root->left && !doDFS( root->left, v))
	return false;
    
    if( !v.empty() && root->data <= v[v.size() - 1])
	return false;
    
    v.push_back( root->data);
	
    if( root->right && !doDFS( root->right, v))
	return false;
			    
    return true;
}

bool checkBST(Node* root) {
    if( !root)
	return false;

    vector<int> v;
    return doDFS( root, v);
}