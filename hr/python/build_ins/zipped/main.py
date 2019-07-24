s = list( map( int, input().split()))

n = s[ 0]
x = s[ 1]

X = list()
for i in range( x):
    X.append( list( map( float, input().split())))

zipped = zip(*X)

for i in zipped:
    print( sum( i) / x)