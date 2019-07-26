import re

def floatRegex(string):
    pattern = re.compile( '^([+-]?\d*[.]\d+)$')
    result = pattern.match(string)
    if result:
        return True
    return False

n = int( input())

for i in range( n):
    print( floatRegex( input()))