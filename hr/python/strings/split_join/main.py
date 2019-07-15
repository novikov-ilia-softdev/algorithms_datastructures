def split_and_join(line):
    strList = line.split( ' ')
    return '-'.join( strList)

if __name__ == '__main__':
    line = input()
    result = split_and_join(line)
    print(result)