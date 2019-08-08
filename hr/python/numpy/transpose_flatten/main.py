import numpy

n = list( map( int, input().split()))

l = []
for i in range( n[0]):
    row = list( map( int, input().split()))
    l.append( row)

matrix = numpy.array( l)
print(numpy.transpose(matrix))
print(matrix.flatten())

