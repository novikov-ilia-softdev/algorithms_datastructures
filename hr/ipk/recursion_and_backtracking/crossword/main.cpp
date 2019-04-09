#include <bits/stdc++.h>

using namespace std;

struct Point{
  int i;
  int j;
};

struct Gap{
    Point start;
    Point end;
    int length;
};

typedef vector<string> Crossword;
typedef vector<Gap> Gaps;
typedef set<string> Visited;


string createKey( int i, int j){
    return to_string( i) + "_" + to_string( j);
}

int moveRight( int i, int j, const Crossword& crossword, Visited& visited){
    
    while( j < crossword[ i].size() - 1 && crossword[ i][j + 1] != '+'){
        j++;
        visited.insert( createKey( i, j));
    }
    
    return j;
}

int moveDown( int i, int j, const Crossword& crossword, Visited& visited){
    
    while( i < crossword.size() - 1 && crossword[ i + 1][j] != '+'){
        i++;
        visited.insert( createKey( i, j));
    }
    
    return i;
}


Gaps getGaps( const Crossword& crossword){
    Gaps gaps;
    
    set<string> visitedRight;
    set<string> visitedDown;
    
    for( int i = 0; i < crossword.size(); i++){
        for( int j = 0; j < crossword[ i].size(); j++){
            if( crossword[ i][ j] != '+'){
                if( visitedRight.find( createKey( i, j)) == visitedRight.end()){
                    visitedRight.insert( createKey( i, j));
                    int right = moveRight( i, j, crossword, visitedRight);
                    if( right != j)
                        cout << i << "," << j << " -> " << i << "," << right << endl;
                }
                
                if( visitedDown.find( createKey( i, j)) == visitedDown.end()){
                    visitedDown.insert( createKey( i, j));
                    int down = moveDown( i, j, crossword, visitedDown);
                    if( down != i)
                        cout << i << "," << j << " -> " << down << "," << j << endl;
                }
                
            }
        }
    }
    
    return gaps;
}

/*
isWordSuitsGap
deleteGap
deleteWord

void solveCrosswordRecursive( solvedCrossword, gaps, wordCandidate, words){
    if( !gaps.size())
	return true;
    
    if( isWordSuitsGap( wordCandidate, gaps[ 0])){
        deleteGap( gaps[ 0]);
        deleteWord( wordCandidate, words);
    }
    
    for( auto word in words){
	return solveCrosswordRecursive( solvedCrossword, gaps, word, words)
    }
    
    return false;
}
*/

vector<string> crosswordPuzzle(vector<string> crossword, string words) {
    Gaps gaps = getGaps( crossword);
    
    
    //DebugUtils::printGaps( gaps);
    
    /*
    for( auto word in words){
	vector<string> solvedCrossword = crossword;
	if( solveCrosswordRecursive( solvedCrossword, gaps, word, words))
	    return solvedCrossword;
    }
    */
    
    return crossword;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input00.txt");

    vector<string> crossword(10);

    for (int i = 0; i < 10; i++) {
        string crossword_item;
        getline(fin, crossword_item);

        crossword[i] = crossword_item;
    }

    string words;
    getline(fin, words);

    vector<string> result = crosswordPuzzle(crossword, words);

    for (int i = 0; i < result.size(); i++) {
        fout << result[i];

        if (i != result.size() - 1) {
            fout << "\n";
        }
    }

    fout << "\n";

    fout.close();

    return 0;
}