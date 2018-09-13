#include <bits/stdc++.h>

#include <algorithm>
using namespace std;

int getFairness( const vector<int>& arr, int startIndex, int stopIndex){
    return arr[stopIndex] - arr[startIndex];
}

int maxMin(int k, vector<int> arr) {
    sort( arr.begin(), arr.end());
    int min = getFairness( arr, 0, k - 1);
    for(int i = 1; i <= arr.size() - k; i++)
    {
        int temp = getFairness( arr, i, i + k - 1);
        if( temp < min)
            min = temp;
    }
    
    return min;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int n;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    int k;
    cin >> k;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<int> arr(n);

    for (int i = 0; i < n; i++) {
        int arr_item;
        cin >> arr_item;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        arr[i] = arr_item;
    }

    int result = maxMin(k, arr);

    fout << result << "\n";

    fout.close();

    return 0;
}
