#include <bits/stdc++.h>

using namespace std;

// TODO
class Gap
getGaps
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

vector<string> crosswordPuzzle(vector<string> crossword, string words) {
    vector<Gap> gaps = getGaps( crossword);
    
    for( auto word in words){
	vector<string> solvedCrossword = crossword;
	if( solveCrosswordRecursive( solvedCrossword, gaps, word, words))
	    return solvedCrossword;
    }
    
    return crossword;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin(getenv("input00.txt"));

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
