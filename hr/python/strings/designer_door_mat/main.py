# Enter your code here. Read input from STDIN. Print output to STDOUT

inStr =  input()
inList = inStr.split()

N = int( inList[ 0])
M = int( inList[ 1])

sign = '.|.'
filler = '-'
welcomeStr = 'WELCOME'

for i in range( (N // 2)):
    print( ((i*2 + 1) * sign).center( M, filler))

print( welcomeStr.center( M, '-'))

for i in reversed(range( (N // 2))):
    print( ((i*2 + 1) * sign).center( M, filler))

