struct Point {
    int x, y;
};

float getMedian( const Point& a, const Point& b){
    return (a.x - b.x) / 2.0;
}

bool hasVerticalSymLine(const std::vector<Point>& v)
{
    if( v.empty())
        return false;
        
    if( v.size() % 2 != 0)
        return false;
    
    std::sort( v.begin(), v.end(), [](const Point& p1, const Point& p2){ return p1.x < p2.x; })
    
    int start = 0;
    int end = v.size() - 1;
    
    float med = getMedian( v[end], v[start]);
    start++;
    end--;
    
    while( start < end){
        float medCandidate = getMedian( v[end], v[start]);
        if( medCandidate != med)
            return false;
            
        start++;
        end--;
    }
    
    return true;
}

// (0, 0) (2, 0) (-1, 1) (3, 1)
// y
// ^
// | *  |  *
// |  * | *
// ----------> x