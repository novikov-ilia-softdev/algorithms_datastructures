#!/bin/python3

import math
import os
import random
import re
import sys

class Tree:
    def __init__( self, nodes, edges):
        self._nodes = nodes
        self._edges = edges

    def get_balanced_forest( self):
        min_node = -1
        for i in range( 0, self._edges.size() - 1):
            for j in range( i + 1, self._edges.size()):
                new_edges = self._make_new_edges( i, j)
                forest = self._get_forest( self._nodes, new_edges)
                new_node = self._get_new_node( forest)
                if(new_node > 0 and new_node < min_node)
                    min_node = new_node

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
