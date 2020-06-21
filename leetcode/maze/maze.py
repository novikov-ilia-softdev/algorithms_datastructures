import queue
from typing import List

def isEscapePossible( blocked: List[List[int]], source: List[int], target: List[int]) -> bool:

    visited = set()
    blockedSet = createBlockedSet(blocked)

    q = queue.Queue()

    q.put(source)

    while not q.empty():

        cur = q.get()

        if isTarget(cur, target):
            return True

        if not isInMaze(cur):
            continue

        if isVisited(cur, visited):
            continue

        if isBlocked(cur, blockedSet):
            continue

        print(cur)

        addToVisited(cur, visited)

        nextPoints = getNextPoints(cur)
        for nextPoint in nextPoints:
            if not isVisited(nextPoint, visited) and isInMaze(nextPoint) and not isBlocked(nextPoint, blockedSet):
                q.put(nextPoint)

    return False
    
def createBlockedSet(blocked):
    s = set()
    
    for p in blocked:
        s.add((p[0], p[1]))
        
    return s

def isInMaze(point):
    
    if not (point[0] >= 0 and point[0] < 1000000):
        return False
    
    if not (point[1] >= 0 and point[1] < 1000000):
        return False
    
    return True
    
    #return 0 <= point[0], point[1] < 1000000

def isVisited(point, visited):
    return (point[0], point[1]) in visited

def isTarget(point, target):
    return point[0] == target[0] and point[1] == target[1]

def isBlocked(point, blockedSet):
    return (point[0], point[1]) in blockedSet

def addToVisited(point, visited):
    visited.add((point[0], point[1]))
    
def getNextPoints(point):
    nxtPts = []
    
    nxtPts.append([point[0] + 1, point[1]])
    nxtPts.append([point[0] - 1, point[1]])
    nxtPts.append([point[0], point[1] + 1])
    nxtPts.append([point[0], point[1] - 1])
    
    return nxtPts


#isEscapePossible(
#[],
#[0,0],
#[999999,999999]
#)

for i in range(0, 1000000):
    for j in range(0, 1000000):
        print(i, j)
