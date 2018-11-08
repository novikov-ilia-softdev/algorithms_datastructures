// Complete the deleteNode function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* deleteNode(SinglyLinkedListNode* head, int position) {
    if( !head)
        return head;
    
    if( position == 0){
        SinglyLinkedListNode* newHead = head->next;
        delete head;
        return newHead;
    }
    
    int curPos = 1;
    SinglyLinkedListNode* prev = head;
    SinglyLinkedListNode* cur = head->next;
    
    while( cur){
        if( curPos == position){
            prev->next = cur->next;
            delete cur;
            break;
        }
        prev = cur;
        cur = cur->next;
        curPos++;
    }
    
    return head;
}