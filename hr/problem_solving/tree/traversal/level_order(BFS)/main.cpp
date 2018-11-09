
/*
class Node {
    public:
        int data;
        Node *left;
        Node *right;
        Node(int d) {
            data = d;
            left = NULL;
            right = NULL;
        }
};
*/
#include<queue>

    void levelOrder(Node * root) {
        if( !root)
            return;
        
        queue<Node*> q;
        q.push( root);
        
        while(!q.empty()){
            Node* node = q.front();
            q.pop();
            cout << node->data << " ";
            if( node->left)
                q.push( node->left);
            if( node->right)
                q.push( node->right);
        }
    }