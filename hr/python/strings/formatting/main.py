def print_formatted(number):
    width = len(bin( number)[2:])
    for n in range( 1, number + 1):
        print( str(n).rjust( width), oct( n)[2:].rjust( width), hex( n)[2:].upper().rjust( width), bin( n)[2:].rjust( width))

if __name__ == '__main__':
    n = int(input())
    print_formatted(n)