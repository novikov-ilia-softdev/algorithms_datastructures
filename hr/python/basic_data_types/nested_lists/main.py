if __name__ == '__main__':
    students = []
    newStudents = []

    for _ in range(int(input())):
        name = input()
        score = float(input())
        students.append( [name, score])

    #print( students)
    worstStudent = min(students, key=lambda x: x[1])
    worstStudentGrade = worstStudent[ 1]

    for student in students:
        #print (student)
        if( worstStudentGrade != student[1]):
            #print( 'delete ', student[ 0])
            newStudents.append( student)
    
    #print( students)

    targetStudent = min(newStudents, key=lambda x: x[1])
    targetStudentGrade = targetStudent[ 1]

    result = []

    for student in newStudents:
        if( targetStudentGrade == student[1]):
            result.append( student[ 0])

    result.sort()

    for student in result:
        print( student)

