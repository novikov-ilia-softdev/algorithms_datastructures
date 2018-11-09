// Complete the has_cycle function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
bool has_cycle(SinglyLinkedListNode* head) {
    if( !head)
        return false;
    
    SinglyLinkedListNode* cur1 = head;
    SinglyLinkedListNode* cur2 = head;
    
    cur1 = cur1->next;
    cur2 = cur2->next;
    if( cur2)
        cur2 = cur2->next;
    
    while( cur1 && cur2){
        if( cur1 == cur2)
            return true;
        
        cur1 = cur1->next;
        cur2 = cur2->next;
        if( cur2)
            cur2 = cur2->next;
    }
    
    return false;
}