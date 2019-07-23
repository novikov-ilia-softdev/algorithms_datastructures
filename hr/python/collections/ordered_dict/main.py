import collections

n = int( input())

orderedDictionary = collections.OrderedDict()

for i in range( n):
    s = input().split()
    k = ' '.join( s[:-1])
    v = int( s[ len(s) - 1])
    if( k in orderedDictionary):
        orderedDictionary[ k] = orderedDictionary[ k] + v
    else:
        orderedDictionary[ k] = v

for i in orderedDictionary:
    print( i, orderedDictionary[ i])

