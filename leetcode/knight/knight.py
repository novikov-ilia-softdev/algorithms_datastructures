import collections

class Solution:
    def getKnightPaths(self, targetPos, blockedList):
        paths = []
        
        blockedSet = set(blockedList)
        
        q = collections.deque()
        visited = set()
        q.appendleft({'pos': (0, 0), 'path': []})
        
        while q:
            curPos = q.pop()

            curPos['path'].append(curPos['pos'])

            if paths and len(curPos['path']) > len(paths[0]):
                continue

            if curPos['pos'] == targetPos:
                paths.append(curPos['path'])

            if curPos['pos'] in visited:
                continue

            if curPos['pos'] in blockedSet:
                continue

            visited.add(curPos['pos'])
            
            for nei in getNeis(curPos['pos']):
                q.appendleft(nei)
                nei['path'] = curPos['path'].copy()
                
        return paths
    
    
def getNeis(pos):
    neis = []
    row = pos[0]
    col = pos[1]

    neis.append({'pos': (row - 2, col + 1), 'path': []})
    neis.append({'pos': (row - 1, col + 2), 'path': []})
    neis.append({'pos': (row + 2, col + 1), 'path': []})
    neis.append({'pos': (row + 1, col + 2), 'path': []})
    neis.append({'pos': (row + 2, col - 1), 'path': []})
    neis.append({'pos': (row + 1, col - 2), 'path': []})
    neis.append({'pos': (row - 2, col - 1), 'path': []})
    neis.append({'pos': (row - 1, col - 2), 'path': []})

    return neis
    
    
print( 'two paths: ', (Solution().getKnightPaths((-3, 3), [])) == [[(0, 0), (-2, 1), (-3, 3)], [(0, 0), (-1, 2), (-3, 3)]])
print( 'one path: ', (Solution().getKnightPaths((-3, 3), [(-1, 2)])) == [[(0, 0), (-2, 1), (-3, 3)]])