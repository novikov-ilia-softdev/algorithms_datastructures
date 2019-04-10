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

bool isClosedChar( char c){
    return (c == '+' || c == 'X');
}

int moveRight( int i, int j, const Crossword& crossword, Visited& visited){
    
    while( j < crossword[ i].size() - 1 && !isClosedChar( crossword[ i][j + 1])){
        j++;
        visited.insert( createKey( i, j));
    }
    
    return j;
}

int moveDown( int i, int j, const Crossword& crossword, Visited& visited){
    
    while( i < crossword.size() - 1 && !isClosedChar( crossword[ i + 1][j])){
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
            if( !isClosedChar(crossword[ i][ j])){
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
    
    if( word.size() != gap.getLength())
        return false;
    
    string gapValue = getGapValue( gap, solvedCrossword);
    
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

void deleteGap( const Gap& gap, Gaps& gaps){
     for( auto it = gaps.begin(); it != gaps.end(); ++it){
        if( it->start.i == gap.start.i &&
            it->start.j == gap.start.j &&
            it->end.i == gap.end.i &&
            it->end.j == gap.end.j
        ){
            gaps.erase( it);
            break;
        }
    }
}

void deleteWord( const string& wordCandidate, Words& words){
    auto it = find(words.begin(), words.end(), wordCandidate);
    if (it != words.end()) words.erase(it);
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

bool solveCrosswordRecursive( Crossword& solvedCrossword, Gap gap, Gaps gaps, string wordCandidate, Words words){
    
    if( !isWordSuitsGap( wordCandidate, gap, solvedCrossword))
        return false;
    
    fillGap( solvedCrossword, gap, wordCandidate);
    deleteGap( gap, gaps);
   
    if( !gaps.size())
        return true;
    
    deleteWord( wordCandidate, words);

    for( auto& gap : gaps){
        for( auto& word : words){
            if( solveCrosswordRecursive( solvedCrossword, gap, gaps, word, words)){
                return true;
            }
        }
    }
    
    return false;
}

vector<string> crosswordPuzzle(vector<string> crossword, string words) {
    Gaps gaps = getGaps( crossword);
    
    if( !gaps.size())
        return crossword;
    
    Words splittedWords = split( words, ';');
    for( auto& gap : gaps){
        for( auto& word : splittedWords){
            Crossword solvedCrossword = crossword;
            if( solveCrosswordRecursive( solvedCrossword, gap, gaps, word, splittedWords)){
                //DebugUtils::printCrossword( solvedCrossword);
                return solvedCrossword;
            }
        }
    }
    
    return crossword;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input02.txt");

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