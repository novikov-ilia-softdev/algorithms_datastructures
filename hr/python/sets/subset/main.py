def isSubset( s1, s2):
    if (len( s1) > len( s2)):
        return False;

    for i in s1:
        if( i not in s2):
            return False

    return True


n = int( input())

for i in range( n):
    input()
    s1 = set( map( int, input().split()))
    input()
    s2 = set( map( int, input().split()))
    print( isSubset( s1, s2))
