#include <bits/stdc++.h>

using namespace std;

struct Point{
  Point( int i_, int j_): i( i_), j( j_) {}
  int i;
  int j;
};

struct Gap{
    Gap( Point start_, Point end_): start( start_), end( end_) {}
    Point start;
    Point end;
    
    bool isHorizontal() const { return start.i == end.i; }
    int getLength() const {
        if( isHorizontal())
            return end.j - start.j + 1;
        
        return end.i - start.i + 1;
    }
};

typedef vector<string> Crossword;
typedef vector<Gap> Gaps;
typedef set<string> Visited;
typedef vector<string> Words;

string createKey( int i, int j){
    return to_string( i) + "_" + to_string( j);
}

int moveRight( int i, int j, const Crossword& crossword, Visited& visited){
    
    while( j < crossword[ i].size() - 1 && (crossword[ i][j + 1] != '+' && crossword[ i][j + 1] != 'X')){
        j++;
        visited.insert( createKey( i, j));
    }
    
    return j;
}

int moveDown( int i, int j, const Crossword& crossword, Visited& visited){
    
    while( i < crossword.size() - 1 && (crossword[ i + 1][j] != '+' && crossword[ i + 1][j] != 'X')){
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
            if( crossword[ i][ j] != '+' && crossword[ i][ j] != 'X'){
                if( visitedRight.find( createKey( i, j)) == visitedRight.end()){
                    visitedRight.insert( createKey( i, j));
                    int right = moveRight( i, j, crossword, visitedRight);
                    if( right != j){
                        Point start( i, j);
                        Point end( i, right);
                        Gap gap( start, end);
                        gaps.push_back( gap);
                    }
                        
                }
                
                if( visitedDown.find( createKey( i, j)) == visitedDown.end()){
                    visitedDown.insert( createKey( i, j));
                    int down = moveDown( i, j, crossword, visitedDown);
                    if( down != i){
                        Point start( i, j);
                        Point end( down, j);
                        Gap gap( start, end);
                        gaps.push_back( gap);
                        
                    }
                        
                }
                
            }
        }
    }
    
    return gaps;
}

class DebugUtils{
public:
    static void printGaps( const Gaps& gaps){
        for( auto& gap : gaps){
            cout << gap.start.i << "," << gap.start.j << " -> " << gap.end.i << "," << gap.end.j << " (" << gap.getLength() << ")" << endl;
        }
    }
    
    static void printGap( const Gap& gap){
	cout << gap.start.i << "," << gap.start.j << " -> " << gap.end.i << "," << gap.end.j << " (" << gap.getLength() << ")" << endl;
    }
    
    static void printWords( const Words& words){
        for( auto& word : words){
            cout << word << endl;
        }
    }
    
    static void printCrossword( const Crossword& crossword){
        for( auto& line : crossword){
            cout << line << endl;
        }
        cout << endl;
    }
};

string getGapValue( Gap gap, const Crossword& solvedCrossword){
    string res = "";
    
    if( gap.isHorizontal()){
        for( int i = gap.start.j; i <= gap.end.j; i++){
            res += solvedCrossword[ gap.start.i][ i];
        }
    }
    else{
        for( int i = gap.start.i; i <= gap.end.i; i++){
            res += solvedCrossword[ i][ gap.start.j];
        }
    }
    
    return res;
}

bool isWordSuitsGap( string word, Gap gap, const Crossword& solvedCrossword){
    //cout << "isWordSuitsGap" << endl;
    //cout << "word: " << word << endl;
    
    if( word.size() != gap.getLength())
        return false;
    
    string gapValue = getGapValue( gap, solvedCrossword);
    //cout << "gapValue: " << gapValue << endl;
    
    for( int i = 0; i < word.size(); i++){
        if( gapValue[ i] != '-' && gapValue[ i] != word[ i])
            return false;
    }
    
    return true;
}

void fillGap( Crossword& solvedCrossword, Gap gap, string word){
    if( gap.isHorizontal()){
        for( int i = gap.start.j, j = 0; i <= gap.end.j; i++, j++){
            solvedCrossword[ gap.start.i][i] = word[ j];
        }
    }
    else{
        for( int i = gap.start.i, j = 0; i <= gap.end.i; i++, j++){
            solvedCrossword[ i][gap.start.j] = word[ j];
        }
    }
}

bool solveCrosswordRecursive( Crossword& solvedCrossword, Gaps gaps, string wordCandidate, Words words){
    
    //cout << "solveCrosswordRecursive" << endl;
    //cout << "gaps.size(): " << gaps.size() << endl;
    //DebugUtils::printGap( gaps[0]);
    //cout << "wordCandidate: " << wordCandidate << endl;
    if( !gaps.size())
	return true;
    
    if( isWordSuitsGap( wordCandidate, gaps[ 0], solvedCrossword)){
	fillGap( solvedCrossword, gaps[ 0], wordCandidate);
	gaps.erase( gaps.begin());
    
	if( !gaps.size())
	    return true;
    
	auto it = find(words.begin(), words.end(), wordCandidate);
	if (it != words.end()) words.erase(it);
    }
    else{
	//auto it = find(words.begin(), words.end(), wordCandidate);
	//if (it != words.end()) words.erase(it);
	//words.push_back( wordCandidate);
    }
    //DebugUtils::printGaps( gaps);
    //DebugUtils::printWords( words);
    //DebugUtils::printCrossword( solvedCrossword);
    //string temp;
    //getline(cin, temp);
    
    for( auto& word : words){
	if( solveCrosswordRecursive( solvedCrossword, gaps, word, words))
            return true;
    }
    
    return false;
}

Words split(const string &s, char delim) {
    stringstream ss(s);
    string item;
    Words elems;
    while (getline(ss, item, delim)) {
        elems.push_back(item);
    }
    
    return elems;
}

vector<string> crosswordPuzzle(vector<string> crossword, string words) {
    Gaps gaps = getGaps( crossword);
    //DebugUtils::printGaps( gaps);
    
    Words splittedWords = split( words, ';');
    //DebugUtils::printWords( splittedWords);
    
    for( auto& word : splittedWords){
	Crossword solvedCrossword = crossword;
	//cout << word << endl;
	if( solveCrosswordRecursive( solvedCrossword, gaps, word, splittedWords)){
	    //DebugUtils::printCrossword( solvedCrossword);
	    return solvedCrossword;
	}
	    
    }
    
    return crossword;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input06.txt");

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