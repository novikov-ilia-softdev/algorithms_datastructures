def count_substring(string, sub_string):
    count = 0
    pos = string.find( sub_string)
    
    while( pos != -1):
        count += 1
        pos += 1
        string = string[ pos:]
        pos = string.find( sub_string)

    return count

if __name__ == '__main__':
    string = input().strip()
    sub_string = input().strip()
    
    count = count_substring(string, sub_string)
    print(count)