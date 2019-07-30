import re

#Positive Lookbehind
v = 'aeiou'
c = 'qwrtypsdfghjklzxcvbnm'
regex = r'(?<=[%s])[%s]{2,}[%s]' % (c, v, c)
str = input()

matches = re.findall(regex, str, flags=re.I)

if( len( matches) == 0):
    print( -1)
else:
    for m in matches:
        print(m[:-1])
