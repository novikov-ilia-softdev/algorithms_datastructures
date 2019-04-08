#include <bits/stdc++.h>

using namespace std;

class Gap{
    
};

void solveCrosswordRecursive( crossword, solvedCrossword, gaps, words){
    if( !gaps.size())
	return true;
    
    for( auto word in words){
	fillGap( gaps[ 0], word);
	deleteGap( gaps[ 0]);
	deleteWord
	if( solveCrosswordRecursive( crossword, gaps, words))
	    return;
    }
    
    return false
}

vector<string> crosswordPuzzle(vector<string> crossword, string words) {
    vector<Gap> gaps = getGaps( crossword);
    
    vector<string> solvedCrossword = crossword;
    solveCrosswordRecursive( crossword, gaps, words);
    
    return solvedCrossword;
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
