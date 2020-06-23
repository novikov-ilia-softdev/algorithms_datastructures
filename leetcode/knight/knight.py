import collections

class Solution:
    def getKnightPaths(self, srcPos, targetPos, blockedList):
        pathsToTarget = []
        
        blockedSet = set(blockedList)
        
        q = collections.deque()
        q.appendleft({'path': [srcPos], 'visited': set()})
        
        while q:
            curPos = q.pop()
            curPath = curPos['path']
            visited = curPos['visited']

            if pathsToTarget and len(curPath) > len(pathsToTarget[0]):
                continue

            if curPath[-1] == targetPos:
                pathsToTarget.append(curPath)
                continue

            if curPath[-1] in visited:
                continue

            if curPath[-1] in blockedSet:
                continue

            visited.add(curPath[-1])
            
            for nei in getNeis(curPath[-1]):
                neiPath = curPath.copy()
                neiPath.append(nei)
                q.appendleft({'path': neiPath, 'visited': visited.copy()})

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
    
    
print('two paths: ', len((Solution().getKnightPaths((0, 0), (-3, 3), []))) == 2)
print('one path: ', len((Solution().getKnightPaths((0, 0), (-3, 3), [(-1, 2)]))) == 1)
print('visited: ', len((Solution().getKnightPaths((0, 0), (-5, 4), []))) == 3)