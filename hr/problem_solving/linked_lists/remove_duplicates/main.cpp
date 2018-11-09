// Complete the removeDuplicates function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* removeDuplicates(SinglyLinkedListNode* head) {
    SinglyLinkedListNode* cur = head;
    SinglyLinkedListNode* prev = NULL;
    
    while( cur){
        if( cur->next && cur->data == cur->next->data){
            if( prev){
                prev->next = cur->next;
                delete cur;
                cur = prev->next;
            }
            else{
                SinglyLinkedListNode* oldHead = head;
                head = head->next;
                delete oldHead;
                cur = head;
            }  
        }
        else{
            prev = cur;
            cur = cur->next;
        }
    }
    
    return head;
}