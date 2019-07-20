def isSuperSet( ss, s):
    if( len( ss) <= len( s)):
        return False

    for i in s:
        if( i not in ss):
            return False

    return True

ss = set( map(int, input().split()))
n = int(input())

res = True

for i in range( n):
    s = set( map(int, input().split()))
    if( not isSuperSet( ss, s)):
        res = False
        break

print( res)

