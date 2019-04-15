#include <bits/stdc++.h>
#include <stdlib.h> 

using namespace std;

bool curGreaterPrev( const vector<int>& arr, int curIndex, int prevIndex){
    return arr[ curIndex] > arr[ prevIndex];
}

void addCandies( vector<int>& arr, int curIndex, int prevIndex){
    arr[ curIndex] += abs( arr[ curIndex] - arr[ prevIndex]) + 1;
}

void walkForward( const vector<int>& marks, vector<int>& candies){
    for( int i = 1; i < marks.size(); i++){
        if( curGreaterPrev( marks, i, i - 1) && !curGreaterPrev( candies, i, i - 1))
	    addCandies( candies, i, i - 1);
    }
}

void walkBackward( const vector<int>& marks, vector<int>& candies){
    for( int i = marks.size() - 2; i >= 0; i--){
	if( curGreaterPrev( marks, i, i + 1) && !curGreaterPrev( candies, i, i + 1))
	    addCandies( candies, i, i + 1);
    }
}

long getCandiesCount(int n, vector<int> marks) {
    
    vector<int> candies(marks.size(), 1);
      
    walkForward( marks, candies);
    walkBackward( marks, candies);
    
    long res = 0;
    for( auto c: candies){
	res += c;
    }
    
    return res;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input00.txt");

    int n;
    fin >> n;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<int> arr(n);

    for (int i = 0; i < n; i++) {
        int arr_item;
        fin >> arr_item;
        fin.ignore(numeric_limits<streamsize>::max(), '\n');

        arr[i] = arr_item;
    }

    long result = getCandiesCount(n, arr);

    fout << result << "\n";

    fout.close();

    return 0;
}
