// Complete the getNode function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
#include <stack>
int getNode(SinglyLinkedListNode* head, int positionFromTail) {
    stack<int> st;
    SinglyLinkedListNode* cur = head;
    while( cur){
        st.push( cur->data);
        cur = cur->next;
    }
    
    int count = 0;
    while( count != positionFromTail){
        st.pop();
        count++;
    }
    return st.top();
}