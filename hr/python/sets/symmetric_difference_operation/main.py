n = int( input())
nS = set( map( int, input().split()))

m = int( input())
mS = set( map( int, input().split()))

print( len( nS.symmetric_difference( mS)))
