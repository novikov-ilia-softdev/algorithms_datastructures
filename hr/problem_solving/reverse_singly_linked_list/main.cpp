// Complete the reverse function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* reverse(SinglyLinkedListNode* head) {
    if( !head)
        return head;
    
    SinglyLinkedListNode* cur = head;
    SinglyLinkedListNode* next = NULL;
    SinglyLinkedListNode* prev = NULL;
    
    while( cur){
        next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    
    return prev;
}