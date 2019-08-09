import numpy

nmp = list( map( int, input().split()))

arrays = []

for i in range( nmp[ 0] + nmp[ 1]):
    arr = numpy.array( [ list( map( int, input().split()))])
    arrays.append(arr)

print( numpy.concatenate((arrays), axis = 0))
