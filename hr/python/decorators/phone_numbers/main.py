def wrapper(f):
    def fun(l):
        res = []
        for i in l:
            if( len( i) == 13):
                res.append( '+91 ' + i[3:8] + ' ' + i[8:]) 
            if( len( i) == 12):
                res.append( '+91 ' + i[2:7] + ' ' + i[7:]) 
            if( len( i) == 11):
                res.append( '+91 ' + i[1:6] + ' ' + i[6:])
            if( len( i) == 10):
                res.append( '+91 ' + i[0:5] + ' ' + i[5:])

        return f( res)

    return fun

@wrapper
def sort_phone(l):
    print(*sorted(l), sep='\n')

if __name__ == '__main__':
    l = [input() for _ in range(int(input()))]
    sort_phone(l) 


