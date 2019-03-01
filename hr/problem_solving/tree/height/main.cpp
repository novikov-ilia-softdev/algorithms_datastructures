// recursive
int height(Node* root) {
    if( !root)
        return -1;

    int l = height( root->left);
    int r = height( root->right);

    if( l > r)
        return l + 1;
    
    return r + 1;
}

// iterative (level order)
struct NodeInfo{
    NodeInfo( Node* n, int l){
        node = n;
        level = l;
    }
    Node* node;
    int level;
};

int height(Node* root) {
    if( !root)
        return 0;

    int h = 0;
    queue<NodeInfo> q;
    q.push( NodeInfo( root, 0));

    while( !q.empty()){
        NodeInfo cur = q.front();
        q.pop();
        h = cur.level;
        
        if( cur.node->left)
            q.push( NodeInfo( cur.node->left, cur.level + 1));

        if( cur.node->right)
            q.push( NodeInfo( cur.node->right, cur.level + 1));
    }

    return h;
}