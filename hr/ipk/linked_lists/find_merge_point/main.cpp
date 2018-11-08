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
#include <vector>
#include <algorithm>
#include <stdlib.h>

void printList( SinglyLinkedListNode* head)
{
    SinglyLinkedListNode* cur = head;
    while( cur)
    {
        std::cout << cur->data << " ";
        cur = cur->next;
    }
    std::cout << std::endl;
}

int findMergeNode(SinglyLinkedListNode* head1, SinglyLinkedListNode* head2) {
    std::vector<SinglyLinkedListNode*> v1;
    std::vector<SinglyLinkedListNode*> v2;
    
    SinglyLinkedListNode* cur1 = head1;
    while( cur1){
        v1.push_back( cur1);
        cur1 = cur1->next;
    }
    
    SinglyLinkedListNode* cur2 = head2;
    while( cur2){
        v2.push_back( cur2);
        cur2 = cur2->next;
    }
    /*
    std::cout << "v1" << endl;
    std::for_each(v1.begin(),
                  v1.end(),
    [](SinglyLinkedListNode* node){ std::cout << node << ": " << node->data << " "; });
    std::cout << endl;
    
    std::cout << "v2" << endl;
    std::for_each(v2.begin(),
                  v2.end(),
    [](SinglyLinkedListNode* node){ std::cout << node << ": " << node->data << " "; });
    std::cout << endl;
    */
    
    std::reverse(v1.begin(),v1.end());
    std::reverse(v2.begin(),v2.end());
    
    std::cout << "v1 revert" << endl;
    std::for_each(v1.begin(),
                  v1.end(),
    [](SinglyLinkedListNode* node){ std::cout /*<< node << ": "*/ << node->data << " "; });
    std::cout << endl;
    
    std::cout << "v2 revert" << endl;
    std::for_each(v2.begin(),
                  v2.end(),
    [](SinglyLinkedListNode* node){ std::cout /*<< node << ": "*/ << node->data << " "; });
    std::cout << endl;
    
    int diff = v1.size() - v2.size();
    diff = abs(diff);
    int i = 0;
    for(;v1[ i]->data == v2[ i]->data && v1[i] != head1 && v2[i] != head2; i++)
    //for(; i < diff && v1[ i]->data == v2[ i]->data && v1[i] != head1 && v2[i] != head2; i++)
    { 
    }
    
    std::cout << "v1.size(): " << v1.size() << std::endl;
    std::cout << "v2.size(): " << v2.size() << std::endl;
    std::cout << "diff: " << diff << std::endl;
    std::cout << "i: " << i << std::endl;
    int res = i ? v1[i-1]->data : v1[i]->data;
    std::cout << "res: " << res << std::endl << std::endl;
    
    return res;
    //return i ? v1[i-1]->data : v1[i]->data;
}