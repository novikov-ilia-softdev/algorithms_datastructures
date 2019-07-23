import collections

n = int( input())

deque = collections.deque()

for i in range( n):
    cmd = input().split()

    if( cmd[ 0] == 'append'):
        deque.append( int( cmd[ 1]))

    if( cmd[ 0] == 'appendleft'):
        deque.appendleft( int( cmd[ 1]))

    if( cmd[ 0] == 'pop'):
        deque.pop()

    if( cmd[ 0] == 'popleft'):
        deque.popleft()

res = ''
for i in deque:
    res += str(i)
    res += ' '

res = res[:-1]
print( res)