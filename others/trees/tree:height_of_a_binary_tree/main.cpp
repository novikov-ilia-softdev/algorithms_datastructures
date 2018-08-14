
/*The tree node has data, left child and right child 
class Node {
    int data;
    Node* left;
    Node* right;
};

*/
#include <vector>
#include <algorithm>

int height(Node* root) {
    if( !root)
        return 0;
    
    std::vector<int> pathsLengths;
    traverse(root, -1, pathsLengths);
    std::vector<int>::iterator max = std::max_element(pathsLengths.begin(), pathsLengths.end());
    return *max;
}

void traverse(Node* node, int parentLevel, std::vector<int>& pathsLengths) {
    if( !node){
        pathsLengths.push_back( parentLevel);
        return;
    }
    
    int currentLevel = parentLevel + 1;
        
    traverse( node->left, currentLevel, pathsLengths);
    traverse( node->right, currentLevel, pathsLengths);
}