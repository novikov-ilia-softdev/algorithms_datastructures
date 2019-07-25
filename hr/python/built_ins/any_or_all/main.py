def isPalindromic( k):
    s = str( k)
    start = 0
    end = len( s) - 1

    while( start < end):
        if( s[start] != s[end]):
            return False

        start += 1
        end += 1

    return True

input()

l = list( map (int, input().split()))
if( all( k > 0 for k in l)):
    if( any( isPalindromic( k) for k in l)):
        print( True)
    else:
        print( False)
else:
    print( False)

