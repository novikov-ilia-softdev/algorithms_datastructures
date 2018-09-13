// Complete the sortedInsert function below.

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
DoublyLinkedListNode* getTail( DoublyLinkedListNode* head)
{
    DoublyLinkedListNode* cur = head;
    while( cur->next){
        cur = cur->next;
    }
    return cur;
}

DoublyLinkedListNode* sortedInsert(DoublyLinkedListNode* head, int data) {
    DoublyLinkedListNode* newNode = new DoublyLinkedListNode(data);
    
    if( newNode->data < head->data)
    {
        newNode->next = head;
        head->prev = newNode;
        head = newNode;
        return head;
    }
    
    DoublyLinkedListNode* tail = getTail( head);
    
    if( newNode->data > tail->data)
    {
        newNode->prev = tail;
        tail->next = newNode;
        tail = newNode;
        return head;
    }
    
    DoublyLinkedListNode* curNode = head->next;
    while( curNode){
        if( newNode->data >= curNode->prev->data &&
            newNode->data <= curNode->data)
        {
            curNode->prev->next = newNode;
            newNode->prev = curNode->prev;
            newNode->next = curNode;
            curNode->prev = newNode;
            break;
        }
        curNode = curNode->next;
    }
    return head;
}