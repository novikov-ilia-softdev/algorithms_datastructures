// Complete the insertNodeAtTail function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* insertNodeAtTail(SinglyLinkedListNode* head, int data) {
    if( !head){
        SinglyLinkedListNode* newNode = new SinglyLinkedListNode( data);
        return newNode;
    }
    
    SinglyLinkedListNode* cur = head;
    while( 1){
        if( !cur->next)
            break;
        
        cur = cur->next;
    }
    
    SinglyLinkedListNode* newNode = new SinglyLinkedListNode( data);
    cur->next = newNode;
        
    return head;
}