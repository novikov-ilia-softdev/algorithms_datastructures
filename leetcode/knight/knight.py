import collections
import copy

class Solution:
    def getKnightPaths(self, targetPos, blockedList):
        paths = []
        
        blockedSet = set(blockedList)
        
        q = collections.deque()
        q.appendleft({'i': 0, 'j': 0, 'path':[(0, 0)], 'visited': set()})
        
        while q:
            curPos = q.pop()
            
            if paths and len(curPos['path']) > len(paths[0]):
                continue
            
            if curPos['i'] == targetPos['i'] and curPos['j'] == targetPos['j']:
                paths.append(curPos['path'])
                
            if (curPos['i'], curPos['j']) in curPos['visited']:
                continue
            
            if (curPos['i'], curPos['j']) in blockedSet:
                continue
            
            curPos['visited'].add((curPos['i'], curPos['j']))
            
            for nei in getNeis(curPos):
                q.appendleft(nei)
                
        return paths
    
    
def getNeis(pos):
    neis = []
    
    up = copy.deepcopy(pos)
    up['i'] += 1
    up['path'].append((up['i'], up['j']))
    neis.append(up)
    
    down = copy.deepcopy(pos)
    down['i'] -= 1
    down['path'].append((down['i'], down['j']))
    neis.append(down)
    
    left = copy.deepcopy(pos)
    left['j'] -= 1
    left['path'].append((left['i'], left['j']))
    neis.append(left)
    
    right = copy.deepcopy(pos)
    right['j'] += 1
    right['path'].append((right['i'], right['j']))
    neis.append(right)
    
    return neis
    
    
print(Solution().getKnightPaths({'i': 1, 'j': 1}, []))
