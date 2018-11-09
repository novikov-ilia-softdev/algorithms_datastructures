// Complete the compare_lists function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
bool compare_lists(SinglyLinkedListNode* head1, SinglyLinkedListNode* head2) {
    SinglyLinkedListNode* cur1 = head1;
    SinglyLinkedListNode* cur2 = head2;
    
    while( cur1 && cur2){
        if( cur1->data != cur2->data)
            return false;
        
        cur1 = cur1->next;
        cur2 = cur2->next;
    }
    
    if( !cur1 && !cur2)
        return true;
    
    return false;
}