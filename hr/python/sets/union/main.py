# Enter your code here. Read input from STDIN. Print output to STDOUT
n = int( input())
nS = set( map( int, input().split()))

m = int( input())
mS = set( map( int, input().split()))

print( len( nS.union( mS)))
