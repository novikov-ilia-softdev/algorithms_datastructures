n = int( input())

l = list(map(int, input().split()))
captainS = set()
notCaptainS = set()

for i in l:
    if( i in notCaptainS):
        continue

    if( i in captainS):
        captainS.remove( i)
        notCaptainS.add( i)
        continue

    captainS.add( i)

print( captainS.pop())