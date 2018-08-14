// Compiled with: g++ -Wall -std=c++11 1task.cpp
// TASK 2
// Given a collection of intervals, merge all overlapping intervals.
// For example,
// Given [1,3],[8,10],[2,6],[15,18]
// return [1,6],[8,10],[15,18].

#include <iostream>
#include <vector>
#include <utility>
#include <algorithm>

class Main{
private:
    struct Point{
	int value;
	bool isStart;
    };

    typedef std::vector<Point> PointVector;
    
public:
    typedef std::pair<int,int> intPair;
    typedef std::vector<intPair> intPairVector;
    static intPairVector mergeIntervals( const intPairVector& intervals);
    static void showIntervals( const intPairVector& intervals);
};

Main::intPairVector Main::mergeIntervals( const intPairVector& intervals)
{
    PointVector pointVector;
    for( auto interval : intervals) 
    {
        Point startPoint;
	startPoint.value = interval.first;
	startPoint.isStart = true;
	pointVector.push_back( startPoint);
	
	Point stopPoint;
	stopPoint.value = interval.second;
	stopPoint.isStart = false;
	pointVector.push_back( stopPoint);
    }
    
    std::sort( pointVector.begin(), pointVector.end(), 
	[](const Point &a, const Point & b) -> bool
	{ 
	    return a.value < b.value; 
	});
    
    intPairVector mergedIntervals;
    int startCount = 0;
    intPair interval;
    
    for( auto point : pointVector) 
    {
        if( point.isStart)
	{
	    startCount++;
	    if( startCount > 1)
		continue;
	    
	    interval.first = point.value;
	}
	else
	{
	    startCount--;
	    if( startCount == 0)
	    {
		interval.second = point.value;
		mergedIntervals.push_back( interval);
	    }
	}
    }
    
    return mergedIntervals;
}

void Main::showIntervals( const intPairVector& intervals)
{
    for( auto interval : intervals) 
    {
        std::cout << interval.first << "-" << interval.second << std::endl;
    }
}

int main( int argc, char* argv[]){
    Main::intPairVector intervals;
    
    Main::intPair firstInterval( 1, 3);
    Main::intPair secondInterval( 8, 10);
    Main::intPair thirdInterval( 2, 6);
    Main::intPair fourthInterval( 15, 18);
    
    intervals.push_back( firstInterval);
    intervals.push_back( secondInterval);
    intervals.push_back( thirdInterval);
    intervals.push_back( fourthInterval);
    
    Main::intPairVector mergedIntervals = Main::mergeIntervals( intervals);
    
    // prints 1-6, 8-10, 15-18
    Main::showIntervals( mergedIntervals);
    
    return 0;
}