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
struct NodeInfo{
    NodeInfo( Node* n, int h){
	node = n;
	hd = h;
    }
    Node* node;
    int hd;
};

void topView(Node * root) {
    if( !root)
	return;
    
    map<int,int> m;
    queue<NodeInfo> q;
    q.push( NodeInfo(root, 0));

    while( !q.empty()){
	NodeInfo cur = q.front();
	q.pop();

	if( m.count( cur.hd) == 0)
	    m[ cur.hd] = cur.node->data;

	if( cur.node->left)
	    q.push( NodeInfo( cur.node->left, cur.hd - 1));

	if( cur.node->right)
	    q.push( NodeInfo( cur.node->right, cur.hd + 1));
    }

    for( auto it = m.begin(); it != m.end(); it++){
	cout << it->second << " ";
    }
}