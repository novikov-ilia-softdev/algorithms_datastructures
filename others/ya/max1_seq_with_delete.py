"""
Дан массив из нулей и единиц. 
Нужно определить, какой максимальный по длине подинтервал единиц можно получить,
удалив ровно один элемент массива.
Удалять один элемент из массива ОБЯЗАТЕЛЬНО.

"""
def maxOnes(v):
    res = 0
    
    lenZeroes = 0
    lenOnes1 = 0
    lenOnes2 = 0
    
    for i in range(0, len(v)):
        if v[i] == 1:
            if lenZeroes == 0:
                lenOnes1 += 1
            elif lenZeroes == 1:
                lenOnes2 += 1
                
            lenZeroes = 0
        else:
            lenZeroes += 1
            
            if lenZeroes == 1:
                if not lenOnes2:
                    continue
                
                res = max(res, lenOnes1 + lenOnes2)
                lenOnes1 = lenOnes2
            
            elif lenZeroes == 2:
                
                lenOnes1 = 0
                lenOnes2 = 0
                lenZeroes = 0
        
    res = max(res, lenOnes1 + lenOnes2)
    return res

assert(maxOnes([0, 0]) == 0)
assert(maxOnes([1, 0]) == 1)
assert(maxOnes([0, 1]) == 1)
assert(maxOnes([1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1]) == 6)
assert(maxOnes([1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1]) == 7)
assert(maxOnes([1, 0, 0, 0, 1]) == 1)
