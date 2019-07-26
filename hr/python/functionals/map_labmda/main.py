cube = lambda x: x**3 # complete the lambda function 

def fibonacci(n):
    if( n == 0):
        return []

    if( n == 1):
        return [ 0]

    fiboL = [0, 1]
    for i in range( 2, n):
        fiboL.append( fiboL[ i - 2] + fiboL[ i - 1])

    return fiboL

if __name__ == '__main__':
    n = int(input())
    print(list(map(cube, fibonacci(n))))