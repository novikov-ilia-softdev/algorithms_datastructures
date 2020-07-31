from typing import List
import collections

class Solution:
    def cutOffTree(self, forest: List[List[int]]) -> int:
        self.lenRows = len(forest)
        self.lenCols = len(forest[0])
        
        trees = sorted((v, r, c) for r, row in enumerate(forest)
                       for c, v in enumerate(row) if v > 1)
        
        curPos = { 'i': 0, 'j': 0}
        
        totalDist = 0
        
        for tree in trees:
            stepDist = self.bfs(forest, curPos, { 'i': tree[1], 'j': tree[2]})
            if stepDist == -1:
                return -1
            
            totalDist += stepDist
            curPos = { 'i': tree[1], 'j': tree[2]}
        
        return totalDist
    
    def bfs(self, forest, srcPos, targetPos):
        q = collections.deque()
        visited = set()

        q.appendleft({'i': srcPos['i'], 'j': srcPos['j'], 'steps': 0})
        markVisited(srcPos, visited)

        while q:
            curPos = q.pop()

            if isTarget(curPos, targetPos):
                return curPos['steps']

            for nei in getNeis(curPos):

                if self.isInGrid(nei, forest) and not isVisited(nei, visited) and not isBlocked(nei, forest):

                    markVisited(nei, visited)
                    q.appendleft(nei)

        return -1
    
    def isInGrid(self, curPos, forest):
        if not (0 <= curPos['i'] < self.lenRows):
            return False

        if not (0 <= curPos['j'] < self.lenCols):
            return False

        return True

    
def getTrees(forest):
    trees = []
    
    for i in range(0, len(forest)):
        for j in range(0, len(forest[i])):
            if forest[i][j] > 1:
                trees.append({ 'i': i, 'j': j, 'height': forest[i][j]})
                
    return trees

def isBlocked(curPos, forest):
    return forest[curPos['i']][curPos['j']] == 0

def isVisited(curPos, visited):
    return (curPos['i'], curPos['j']) in visited

def markVisited(curPos, visited):
    visited.add((curPos['i'], curPos['j']))
    
def isTarget(srcPos, targetPos):
    return srcPos['i'] == targetPos['i'] and srcPos['j'] == targetPos['j']

def getNeis(pos):
    neis  = []
    
    neis.append({ 'i': pos['i'] + 1, 'j': pos['j'],     'steps': pos['steps'] + 1})
    neis.append({ 'i': pos['i'] - 1, 'j': pos['j'],     'steps': pos['steps'] + 1})
    neis.append({ 'i': pos['i'],     'j': pos['j'] + 1, 'steps': pos['steps'] + 1})
    neis.append({ 'i': pos['i'],     'j': pos['j'] - 1, 'steps': pos['steps'] + 1})
    
    return neis


forest = [[90207,51980,80468,69112,63088,17620,33835,50568,45803,79034,9724,25005,0,98289,95441,0,42510,86541],[21618,10160,53653,0,87646,4442,48449,24751,48272,8654,89393,41053,19898,0,9145,0,92204,84524],[11050,82998,30933,65515,78046,15475,23872,29033,53029,51928,97389,7976,34809,0,70031,87446,0,22025],[38037,82868,55313,99558,76769,2206,75795,41399,26633,16282,21091,21542,50669,64281,79029,77247,85953,46123],[7181,15322,16138,7600,46847,18937,98726,31892,84792,83835,20334,55119,42511,29150,0,48998,175,6346],[28982,0,40918,86458,9045,42165,72174,63748,41067,86982,46830,29472,53423,43484,17720,93301,39534,0],[98266,0,86006,24941,26586,50986,7061,67963,14750,25470,46211,78645,84500,6630,8706,23355,87274,0],[32837,17956,67075,43937,82700,68549,60081,10099,76940,66416,49413,81587,70539,0,81450,35532,46474,2395],[47294,89746,37062,67497,52123,71115,95134,94008,59862,0,0,87953,71136,0,45582,35517,32791,0],[89640,76239,48839,80090,4112,0,29879,48027,0,7411,7890,7692,56775,59822,26279,0,0,32745],[21470,33347,93159,41118,73524,42875,54175,45015,34664,49896,79955,19392,96227,71861,36492,8911,8247,18347],[83089,53747,64481,55311,47591,32557,68790,68729,99066,53876,86797,91809,41311,62771,68324,65964,98252,95447],[56094,16475,0,0,92975,0,39697,31541,42011,24895,4340,13387,10796,74160,33003,98843,13499,85735],[0,0,33295,59470,0,91958,30272,0,48657,21823,44257,12464,76840,15714,82001,37121,26319,22952],[56859,94572,74187,50026,97398,41763,0,41416,3794,78896,78486,34155,13542,0,21786,0,40831,0],[13337,68779,4320,80346,62235,23157,93311,90902,20271,20310,22889,26742,55081,44496,80641,36991,0,94260],[76397,66931,0,67416,24252,97028,60127,5475,30171,49518,16853,489,0,92188,75430,34201,22531,55728],[7370,0,0,34184,64739,0,20400,47690,4686,99991,98392,77834,64222,18163,42193,92208,98338,16532],[39401,94818,17085,14544,44279,15717,53984,72552,64036,0,60932,21693,8552,0,83853,41705,84816,37292],[19235,64590,96391,97366,90047,83227,26385,19688,9060,32402,45761,6703,6152,19448,72511,55129,31019,87078],[17898,75701,55566,27221,79183,45297,52683,29840,21300,8566,0,45190,98328,60988,4475,38630,1398,16254],[23483,0,80564,21657,0,0,43812,17323,51239,99265,44922,69647,20157,25341,59051,28744,32885,26815],[36760,13716,46515,59594,16971,47720,71078,27615,20601,48912,0,31559,95475,63148,45302,37972,38003,90790],[9388,92156,17093,30196,6326,90302,83010,96904,6985,91039,73261,63638,85415,77170,0,42796,95882,47210],[54218,23311,78632,18483,99284,47849,84268,21509,3262,13382,10897,31120,35551,38481,46982,0,29782,29418],[78553,62797,50137,91331,16373,82110,99825,33859,4861,36471,69519,62728,87053,0,16381,32154,28925,54431],[85813,73505,50904,68498,96267,46229,0,63581,24683,16,0,21334,12512,32987,63926,20646,94626,90643],[24982,0,0,64177,79545,61864,65038,46605,61499,27735,12004,12029,61809,34195,73417,31557,39779,14682]]

solution = Solution()
print(solution.cutOffTree(forest))