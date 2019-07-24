import math

class Points(object):
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    def __sub__(self, no):
        return Points( self.x - no.x, self.y - no.y, self.z - no.z)

    def dot(self, no):
        return (self.x * no.x + self.y * no.y + self.z * no.z)

    def cross(self, no):
        s, o = self, no
        return Points( (s.y * o.z) - (s.z * o.y), (s.z * o.x) - (s.x * o.z), (s.x * o.y) - (s.y * o.x))

    def absolute(self):
        return pow((self.x ** 2 + self.y ** 2 + self.z ** 2), 0.5)

if __name__ == '__main__':