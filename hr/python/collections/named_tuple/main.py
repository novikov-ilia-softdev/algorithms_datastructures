import collections

n = int( input())

Student = collections.namedtuple( 'Student', ','.join( input().split()))

students = []

for i in range( n):
    inp = input().split()
    students.append( Student( inp[ 0], inp[ 1], inp[ 2], inp[ 3]))

print( sum( int(s.MARKS) for s in students) / len( students))