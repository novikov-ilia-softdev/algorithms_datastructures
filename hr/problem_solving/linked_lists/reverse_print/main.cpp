// Complete the reversePrint function below.

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
void reversePrint(SinglyLinkedListNode* head) {
    if( !head)
        return;
    
    stack<int> st;
    SinglyLinkedListNode* cur = head;
    while( cur){
        st.push( cur->data);
        cur = cur->next;
    }
    
    while(!st.empty()){
        cout << st.top() << endl;
        st.pop();
    }
}