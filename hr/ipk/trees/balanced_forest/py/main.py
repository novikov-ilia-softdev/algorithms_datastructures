#!/bin/python3

import math
import os
import random
import re
import sys

def delete_edges(edges, i, j):
    result = []
    for index in range(len(edges)):
        if( index == i or index == j):
            continue

        result.append( edges[index])

    return result

def get_forest(nodes, edges):
    print('get_forest')
    print(nodes)
    print(edges)
    dict = {}

    for i in range(1,len(nodes) + 1):
        dict[i] = []

    for edge in edges:
        dict[edge[0]].append(edge[1])
        dict[edge[1]].append(edge[0])
    
    print( dict)
    print()

class Tree:
    def __init__( self, nodes, edges):
        self._nodes = nodes
        self._edges = edges

    def get_balanced_forest( self):
        min_node = -1
        for i in range( 0, len(self._edges) - 1):
            for j in range( i + 1, len(self._edges)):
                #print( i, j)
                new_edges = delete_edges(self._edges, i, j)
                print( new_edges)
                forest = get_forest( self._nodes, new_edges)
                #new_node = self._get_new_node( forest)
                #if(new_node > 0 and new_node < min_node):
                #    min_node = new_node

        return min_node


#[1, 2, 2, 1, 1]
#[[1, 2], [1, 3], [3, 5], [1, 4]]
def balancedForest(c, edges):
    print( c)
    print( edges)
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
