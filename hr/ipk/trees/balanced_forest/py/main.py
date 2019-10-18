#!/bin/python3

import math
import os
import random
import re
import sys
import queue

def delete_edges(edges, i, j):
    result = []
    for index in range(len(edges)):
        if( index == i or index == j):
            continue

        result.append( edges[index])

    return result

def get_forest(nodes, edges):
    #print('get_forest')
    #print(nodes)
    #print(edges)
    dictionary = {}

    for i in range(1,len(nodes) + 1):
        dictionary[i] = {}
        dictionary[i]['with'] = []
        dictionary[i]['val'] = nodes[i - 1]
        dictionary[i]['visited'] = False

    for edge in edges:
        dictionary[edge[0]]['with'].append(edge[1])
        dictionary[edge[1]]['with'].append(edge[0])
    
    #print( dictionary)
   
    forest_sums = []

    for node in dictionary:
        #print( node)
        if( dictionary[node]['visited'] == False):
            treeSum = 0
            q = queue.Queue()
            q.put(node)
            while not q.empty():
                cur = q.get()
                treeSum = treeSum + dictionary[cur]['val']
                dictionary[cur]['visited'] = True
                for i in dictionary[cur]['with']:
                    if( dictionary[i]['visited'] == False):
                        q.put(i)

            forest_sums.append( treeSum)
 
    forest_sums.sort()
    #print(forest_sums)

    print(forest_sums)
    if( len(forest_sums) == 2 and forest_sums[0] == forest_sums[1]):
        return forest_sums[0]
        
    if( len(forest_sums) == 3):
        if(forest_sums[0] == forest_sums[1] == forest_sums[2]):
            return 0
        if(forest_sums[1] == forest_sums[2]):
            return forest_sums[1] - forest_sums[0]
        else:
            return -1

    else:
        return -1
    
    #print()

class Tree:
    def __init__( self, nodes, edges):
        self._nodes = nodes
        self._edges = edges

    def get_balanced_forest( self):
        print('get_balanced_forest')
        min_node = -1

        for i in range( 0, len(self._edges)):
            new_edges = delete_edges(self._edges, i, -1)
            new_node = get_forest( self._nodes, new_edges)
            if(new_node != -1):
                    if(min_node == -1 or new_node < min_node):
                        min_node = new_node

        for i in range( 0, len(self._edges) - 1):
            for j in range( i + 1, len(self._edges)):
                print( i, j)
                new_edges = delete_edges(self._edges, i, j)
                print( new_edges)
                new_node = get_forest( self._nodes, new_edges)
                print( new_node)
                print()
                #new_node = self._get_new_node( forest)
                if(new_node != -1):
                    if(min_node == -1 or new_node < min_node):
                        min_node = new_node

        return min_node


#[1, 2, 2, 1, 1]
#[[1, 2], [1, 3], [3, 5], [1, 4]]
def balancedForest(c, edges):
    #print( c)
    #print( edges)
    tree = Tree( c, edges)
    return tree.get_balanced_forest()

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    q = int(input())

    for q_itr in range(q):
        n = int(input())

        c = list(map(int, input().rstrip().split()))

        edges = []

        for _ in range(n - 1):
            edges.append(list(map(int, input().rstrip().split())))

        result = balancedForest(c, edges)

        fptr.write(str(result) + '\n')

    fptr.close()
