/* Hidden stub code will pass a root argument to the function below. Complete the function to solve the challenge. Hint: you may want to write one or more helper functions.  

The Node struct is defined as follows:
	struct Node {
		int data;
		Node* left;
		Node* right;
	}
*/
#include <vector>

bool checkBST(Node* root) {
    std::vector<int> nodes;
    if( !isAllNodesUnique( root, nodes))
        return false;
    
    if( !checkSubTree( root, root->left, true))
        return false;
    
    return checkSubTree( root, root->right, false);
}


bool isAllNodesUnique(Node* node, std::vector<int>& nodes) {
    if( !node)
        return true;
    
    for( int i = 0; i < nodes.size(); i++)
    {
        if( nodes[ i] == node->data)
            return false;
    }
    
    nodes.push_back(node->data);
    
    if( !isAllNodesUnique( node->left, nodes))
        return false;
    
    return isAllNodesUnique( node->right, nodes);
}

bool checkSubTree( Node* parent, Node* node, bool isLeftSubTree) {
    if( !node)
        return true;
    
//std::cout << "checkSubTree: " << parent->data << ", " << node->data << ", " << isLeftSubTree << std::endl;
    
    if( isLeftSubTree)
    {
        if( node->data > parent->data)
            return false;
    }
    else
    {
        if( node->data < parent->data)
            return false;
    }
           
    if( !checkSubTree( parent, node->left, isLeftSubTree))
        return false;

    if( !checkSubTree( parent, node->right, isLeftSubTree))
        return false;
    
    if( !checkSubTree( node, node->left, true))
        return false;
    
    return checkSubTree( node, node->right, false);
}