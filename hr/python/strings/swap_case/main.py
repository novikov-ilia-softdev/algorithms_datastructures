def swap_case(s):

    chList = list( s)

    for i, c in enumerate( chList) :
        if( chList[i].isupper()):
            chList[ i] = chList[ i].lower()
        else:
            chList[ i] = chList[ i].upper()
    
    return ''.join(chList)

if __name__ == '__main__':
    s = input()
    result = swap_case(s)
    print(result)