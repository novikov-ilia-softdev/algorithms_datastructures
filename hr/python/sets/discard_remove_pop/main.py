n = int(input())
s = set(map(int, input().split()))

cmdCount = int( input())
for i in range( cmdCount):
    cmd = input().split()

    if( cmd[0] == 'pop'):
        s.pop()

    if( cmd[0] == 'remove'):
        s.remove( int( cmd[1]))

    if( cmd[0] == 'discard'):
        s.discard( int( cmd[1]))

print( sum( s))

