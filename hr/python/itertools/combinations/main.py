import itertools

l = input().split()
k = int( l[ 1])

s = ''.join(sorted( l[ 0]))

for i in range( 1, k + 1):
    l = list( itertools.combinations( s, i))
    for j in l:
        print( ''.join( j))