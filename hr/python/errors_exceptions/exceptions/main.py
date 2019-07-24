n = int( input())

for i in range( n):
    try:
        cmd = list( map( int, input().split()))
        a = cmd[ 0]
        b = cmd[ 1]
        print(a // b)
        
    except Exception as e:
        print( 'Error Code:', e)

