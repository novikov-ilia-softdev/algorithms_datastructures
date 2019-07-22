import itertools

l = input().split()
s = l[ 0]
k = int( l[ 1])

res = list( itertools.permutations( s, k))
res.sort()

for i in res:
    print( ''.join( i))
