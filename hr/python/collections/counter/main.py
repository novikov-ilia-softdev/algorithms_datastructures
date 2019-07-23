import collections

input()
shoes = map( int, input().split())

n = int( input())
counter = collections.Counter( shoes)

sum = 0
for i in range( n):
    cmd = list( map( int, input().split()))
    if( counter[ cmd[ 0]] > 0):
        counter[ cmd[ 0]] = counter[ cmd[ 0]] - 1
        sum = sum + cmd[ 1]
    
print( sum)
