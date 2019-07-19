N1 = int( input())
s1 = input()
tl1 = s1.split()
l1 = list(map(int, tl1))
s1 = set( l1)

N2 = int( input())
s2 = input()
tl2 = s2.split()
l2 = list(map(int, tl2))
s2 = set( l2)

s1DifS2 = s1.difference( s2)
s2DifS1 = s2.difference( s1)

symDif = s1DifS2
symDif.update( s2DifS1)

res = list( symDif)
res.sort()

for i in res:
    print( i)