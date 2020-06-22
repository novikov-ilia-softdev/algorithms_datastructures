import collections

class Solution:
    def getKnightPaths(self, targetPos, blockedList):
        pathsToTarget = []
        
        blockedSet = set(blockedList)
        
        q = collections.deque()
        visited = set()
        q.appendleft([(0, 0)])
        
        while q:
            curPath = q.pop()

            if pathsToTarget and len(curPath) > len(pathsToTarget[0]):
                continue

            if curPath[-1] == targetPos:
                pathsToTarget.append(curPath)

            if curPath[-1] in visited:
                continue

            if curPath[-1] in blockedSet:
                continue

            visited.add(curPath[-1])
            
            for nei in getNeis(curPath[-1]):
                neiPath = curPath.copy()
                neiPath.append(nei)
                q.appendleft(neiPath)

        return pathsToTarget
    
    
def getNeis(pos):
    neis = []
    row = pos[0]
    col = pos[1]

    neis.append((row - 2, col + 1))
    neis.append((row - 1, col + 2))
    neis.append((row + 2, col + 1))
    neis.append((row + 1, col + 2))
    neis.append((row + 2, col - 1))
    neis.append((row + 1, col - 2))
    neis.append((row - 2, col - 1))
    neis.append((row - 1, col - 2))

    return neis
    
    
print('two paths: ', (Solution().getKnightPaths((-3, 3), [])) == [[(0, 0), (-2, 1), (-3, 3)], [(0, 0), (-1, 2), (-3, 3)]])
print('one path: ', (Solution().getKnightPaths((-3, 3), [(-1, 2)])) == [[(0, 0), (-2, 1), (-3, 3)]])