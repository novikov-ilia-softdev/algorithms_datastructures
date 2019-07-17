def print_rangoli(size):
    i = 0
    increase = True
    while i != -1:
        line = chr(96 + size - i)
        cur = i
        while cur != 0:
            cur = cur -1
            line = line.center( len( line) + 2, '-')
            line = line.center( len( line) + 2, chr(96 + size - cur))

        line = line.center( 1 + (size - 1) * 2 + (size - 1) * 2, '-')
        print( line)
        if (i == size - 1):
            increase = False
        
        if( increase):
            i = i + 1
        else:
            i = i - 1

if __name__ == '__main__':
    n = int(input())
    print_rangoli(n)