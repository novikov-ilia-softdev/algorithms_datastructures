#include <bits/stdc++.h>

using namespace std;

// Complete the candies function below.
long candies(int n, vector<int> arr) {
    vector<int> cand;
    for( int i = 0; i < arr.size(); i++){
        cand.push_back( 1);
    }
    
    bool onceMore = true;
    while( onceMore){
        onceMore = false;
        
        for( int i = 1; i < arr.size(); i++){
            if( arr[ i] > arr[ i - 1] && cand[ i] <= cand[ i - 1]){
                cand[ i]++;
                onceMore = true;
            }
            
        }
    
        for( int i = arr.size() - 2; i >= 0; i--){
            if( arr[ i] > arr[ i + 1] && cand[ i] <= cand[ i + 1]){
                cand[ i]++;
                onceMore = true;
            }
                
        }
    }
    
    long res = 0;
    
    for( int i = 0; i < cand.size(); i++){
        res += cand[ i];
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

    long result = candies(n, arr);

    fout << result << "\n";

    fout.close();

    return 0;
}
