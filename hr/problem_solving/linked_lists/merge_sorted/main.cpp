// Complete the mergeLists function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* mergeLists(SinglyLinkedListNode* head1, SinglyLinkedListNode* head2) {
    if( !head1 && !head2)
        return NULL;
    
    if( !head1)
        return head2;
    
    if( !head2)
        return head1;
    
    SinglyLinkedListNode* cur1 = head1;
    SinglyLinkedListNode* cur2 = head2;
    SinglyLinkedListNode* newHead = NULL;
    SinglyLinkedListNode* cur = NULL;
    
    while( cur1 && cur2){
        SinglyLinkedListNode* less = NULL;
        if( cur1->data < cur2->data){
            less = cur1;
            cur1 = cur1->next;
        }
        else{
            less = cur2;
            cur2 = cur2->next;
        }  
        if( !newHead){
            newHead = less;
            cur = newHead;
        }
        else{
            cur->next = less;
            cur = cur->next;
        }
    }
    
    if( cur1)
        cur->next = cur1;
    
    if( cur2)
        cur->next = cur2;
    
    return newHead;
}