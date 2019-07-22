import itertools

l = input().split()
k = int( l[ 1])

s = ''.join(sorted( l[ 0]))

l = list( itertools.combinations_with_replacement( s, k))
for j in l:
    print( ''.join( j))