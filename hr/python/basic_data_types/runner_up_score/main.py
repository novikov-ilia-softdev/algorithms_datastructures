if __name__ == '__main__':
    n = int(input())
    arr = map(int, input().split())
    listArr = list( arr)
    maxElem = max( listArr)
    while maxElem in listArr : listArr.remove(maxElem)
    print( max( listArr))
