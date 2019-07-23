import collections

l = list( map( int, input().split()))

n = l[ 0]
m = l[ 1]

d = collections.defaultdict( list)
for i in range(n):
    d['A'].append( input())

for i in range(m):
    d['B'].append( input())

bList = d[ 'B']
for i in d[ 'B']:
    if i not in d[ 'A']:
        indices = [ -1]
    else:
        indices = [j + 1 for j, x in enumerate( d[ 'A']) if x == i]
    
    res = str( indices)
    res = res[1:-1]
    print( res.replace( ',', ''))