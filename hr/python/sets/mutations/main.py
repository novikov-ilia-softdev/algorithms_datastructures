input()
s = set( map( int, input().split()))

n = int( input())

for i in range( n):
    cmd = input().split()
    newS = set( map( int, input().split()))

    if( cmd[ 0] == 'intersection_update'):
        s.intersection_update( newS)

    if( cmd[ 0] == 'update'):
        s.update( newS)

    if( cmd[ 0] == 'symmetric_difference_update'):
        s.symmetric_difference_update( newS)

    if( cmd[ 0] == 'difference_update'):
        s.difference_update( newS)

print( sum( s))

