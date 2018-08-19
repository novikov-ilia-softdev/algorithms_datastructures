// Complete the reverse function below.

/*
 * For your reference:
 *
 * DoublyLinkedListNode {
 *     int data;
 *     DoublyLinkedListNode* next;
 *     DoublyLinkedListNode* prev;
 * };
 *
 */
DoublyLinkedListNode* reverse(DoublyLinkedListNode* head) {
    if( !head)
        return head;
    
    if( head->prev == nullptr && head->next == nullptr)
        return head;
    
    DoublyLinkedListNode* cur = head;
    DoublyLinkedListNode* newHead = nullptr;
    
    while( cur)
    {
        if( cur == head)
        {
            cur->prev = cur->next;
            cur->next = nullptr;
            cur = cur->prev;
            continue;
        }
        
        if( cur->next == nullptr)
        {
            cur->next = cur->prev;
            cur->prev = nullptr;
            newHead = cur;
            break;
        }
        
        DoublyLinkedListNode* temp = cur->next;
        cur->next = cur->prev;
        cur->prev = temp;
        cur = cur->prev;
    }
    
    return newHead;
}