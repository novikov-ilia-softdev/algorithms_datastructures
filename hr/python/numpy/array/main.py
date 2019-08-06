import numpy

def arrays(arr):
    res = numpy.array(arr, float)
    res = res[::-1]
    return res

arr = input().strip().split(' ')
result = arrays(arr)
print(result)
