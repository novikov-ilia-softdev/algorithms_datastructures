#!/bin/python3

import math
import os
import random
import re
import sys
import queue

class Tree:
    def __init__(self, nodes, edges):
        self._nodes = nodes
        self._edges = edges

    def create_dict(self):
        self._dictionary = {}

        for i in range(1,len(self._nodes) + 1):
            self._dictionary[i] = {}
            self._dictionary[i]['with'] = []
            self._dictionary[i]['val'] = self._nodes[i - 1]
            self._dictionary[i]['visited'] = False

        for edge in self._edges:
            self._dictionary[edge[0]]['with'].append(edge[1])
            self._dictionary[edge[1]]['with'].append(edge[0])

        #print(self._dictionary)

    def create_sum(self, node):
        if(self._dictionary[node]['visited'] == True):
            return 0

        self._dictionary[node]['sum'] = self._dictionary[node]['val']
        self._dictionary[node]['visited'] = True
        for neighbour in self._dictionary[node]['with']:
            self._dictionary[node]['sum'] = self._dictionary[node]['sum'] + self.create_sum(neighbour)

        return self._dictionary[node]['sum']

    def get_balanced_forest(self):
        sums = []
        for node in self._dictionary:
            sums.append(self._dictionary[node]['sum'])

        total_sum = sums[0]
        sums = sums[1:]

        res = -1

        target_subtree_sum = math.ceil(total_sum / 3)
        sums.sort( reverse = True)

        for i in range( 0, len(sums)):
            #1)find target_subtree_sum
            
        return res

def get_need_to_add( total, one, two):
    sums = []
    sums.append( one)
    sums.append( two)
    sums.append( total - one - two)
    sums.sort()
    if(sums[ 1] == sums[2]):
        return sums[1] - sums[0]
    else:
        return -1

#[1, 2, 2, 1, 1]
#[[1, 2], [1, 3], [3, 5], [1, 4]]
def balancedForest(c, edges):
    tree = Tree( c, edges)
    tree.create_dict()
    tree.create_sum( 1)
    #print(tree._dictionary)
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
