import collections

n = int( input())

Student = collections.namedtuple( 'Student', ','.join( input().split()))

students = []

for i in range( n):
    inp = input().split()
    students.append( Student( *inp))

print( sum( int(s.MARKS) for s in students) / len( students))
