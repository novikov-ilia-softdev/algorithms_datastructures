/*
Detect a cycle in a linked list. Note that the head pointer may be 'NULL' if the list is empty.

A Node is defined as: 
    struct Node {
        int data;
        struct Node* next;
    }
*/
#include <set>

bool has_cycle(Node* head) {
    if( !head)
        return false;
    
    Node* cur = head;
    std::set<Node*> nodes;
    while( cur){
        if( nodes.find(cur) != nodes.end())
            return true;
        else
            nodes.insert( cur);
        
        cur = cur->next;
    }
    
    return false;
}