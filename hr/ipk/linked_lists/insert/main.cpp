// Complete the insertNodeAtPosition function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */

SinglyLinkedListNode* insertNodeAtPosition(SinglyLinkedListNode* head, int data, int position) {   
    SinglyLinkedListNode* newNode = new SinglyLinkedListNode(data);
    
    SinglyLinkedListNode* prevNodeAtPosition = nullptr;
    SinglyLinkedListNode* currentNodeAtPosition = head;
    for( int i = 0; i < position; i++)
    {
        prevNodeAtPosition = currentNodeAtPosition;
        currentNodeAtPosition = currentNodeAtPosition->next;
    }
    
    prevNodeAtPosition->next = newNode;
    newNode->next = currentNodeAtPosition;
    
    return head;
}