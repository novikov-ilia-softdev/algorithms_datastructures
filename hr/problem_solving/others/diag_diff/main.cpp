#include <bits/stdc++.h>

using namespace std;

// Complete the diagonalDifference function below.
int diagonalDifference(vector<vector<int>> arr) {
    int leftRightDiagSum = 0;
    int rightLeftDiagSum = 0;
    for( int i = 0; i < arr.size(); i++){
        leftRightDiagSum += arr[i][i];
        rightLeftDiagSum += arr[i][arr.size() - 1 - i];
    }

    return abs( leftRightDiagSum - rightLeftDiagSum);
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<vector<int>> arr(n);
    for (int i = 0; i < n; i++) {
        arr[i].resize(n);

        for (int j = 0; j < n; j++) {
            cin >> arr[i][j];
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    int result = diagonalDifference(arr);

    fout << result << "\n";

    fout.close();

    return 0;
}
