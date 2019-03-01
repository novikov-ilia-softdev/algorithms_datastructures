Дан список интов, повторяющихся элементов в списке нет, т.е. список по факту задает множество.
Нужно преобразовать это множество в строку, сворачивая соседние числа в диапазоны.

l = [1, 4, 5, 2, 3, 9, 8, 11, 0]
"0-5,8-9,11"

std::string makeInterval( int start, int end){
    std::string result = ""
    if( start == end)
        result += std::to_string( startInterval);
    else
        result += std::to_string( startInterval) + "-" + std::to_string( prev);
}

std::string compress(const std::vector<int>& in) {
    if( in.empty())
        return "";
        
    if( in.size() == 1)
        return std::to_string( in[0]);
    
    std::sort( in.begin(), in.end());
    
    std::result = "";
    
    int startInterval = in[ 0];
    int prev = in[ 0];
    auto it = in.begin();
    it++;
    
    for( ; it != in.end(); it++){
        if( *it != prev + 1){
            result += makeInterval( startInterval, prev);
            result += ",";
            startInterval = *it;
        }
        
        prev = *it;
    }
    
    result += makeInterval( startInterval, in[in.size() - 1]);
    
    return result;
}

// []
// [ 1]
// [1, 4, 5, 2, 3, 9, 8, 11, 0]
// [1, 4, 5, 2, 3, 9, 8, 11, 0, 12]

// [1,3,5]

a[i] + b[j] + c[k] == x