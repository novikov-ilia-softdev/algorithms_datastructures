import itertools

a = map( int, input().split())
b = map( int, input().split())

c = list( itertools.product( a, b))

res = ''
for i in c:
    res += str( i)
    res += ' '

res = res[:-1]
print( res)