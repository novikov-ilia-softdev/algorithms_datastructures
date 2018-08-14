/*The tree node has data, left child and right child 
class Node {
    int data;
    Node* left;
    Node* right;
};

*/
#include <vector>
#include <algorithm>

bool getPath(Node *root, int v, std::vector<Node*>& path) {
    if( !root)
        return false;
        
    if( root->data == v){
        path.push_back( root);
        return true;
    }
        
    if( getPath( root->left, v, path)){
        path.push_back( root);
        return true;
    }
        
    if( getPath( root->right, v, path)){
        path.push_back( root);
        return true;
    }
        
    return false;
}

Node *lca(Node *root, int v1,int v2) {
    std::vector<Node*> v1Path;
    getPath( root, v1, v1Path);
    std::vector<Node*> v2Path;
    getPath( root, v2, v2Path);
    
    for( auto v1 = v1Path.begin(); v1 != v1Path.end(); v1++)
    {
        for( auto v2 = v2Path.begin(); v2 != v2Path.end(); v2++)
        {
            if( (*v1)->data == (*v2)->data)
                return *v1;
        }
    }
    
    return root;
}