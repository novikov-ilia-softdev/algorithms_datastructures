if __name__ == '__main__':
    N = int(input())

    myList = []
    #print( N)

    for i in range( N):
        cmd = input().split()
        #print( cmd)

        if( cmd[ 0] == 'print'):
            print( myList)

        if( cmd[ 0] == 'sort'):
            myList.sort()

        if( cmd[ 0] == 'pop'):
            myList.pop( len( myList) - 1)

        if( cmd[ 0] == 'reverse'):
            myList.reverse()

        if( cmd[ 0] == 'insert'):
            myList.insert( int( cmd[ 1]), int( cmd[ 2]))

        if( cmd[ 0] == 'remove'):
            myList.remove( int( cmd[ 1]))

        if( cmd[ 0] == 'append'):
            myList.append( int(cmd[ 1]))