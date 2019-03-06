// Complete the findMergeNode function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
int findMergeNode(SinglyLinkedListNode* head1, SinglyLinkedListNode* head2) {
    SinglyLinkedListNode* cur1 = head1;
    SinglyLinkedListNode* cur2 = head2;

    set<SinglyLinkedListNode*> visited;

    while( cur1 || cur2){
        if( cur1){
            if(visited.count( cur1))
                return cur1->data;

            visited.insert( cur1);
            cur1 = cur1->next;
        }
        
        if( cur2){
            if( visited.count( cur2))
            return cur2->data;

            visited.insert( cur2);
            cur2 = cur2->next;
        }
    }

    return 0;
}