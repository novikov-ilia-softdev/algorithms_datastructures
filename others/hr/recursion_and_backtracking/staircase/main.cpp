#include <bits/stdc++.h>

using namespace std;

int stepPerms(int n) {
    if (n == 1) return 1;
    if (n == 2) return 2;
    if (n == 3) return 4;
        
    static int array[ 36];
    array[0] = 1;
    array[1] = 2;
    array[2] = 4;
    for (int i = 3; i < n; i++) {
        array[i] = array[i-1] + array[i-2] + array[i-3];
    }
    return array[n-1];
}

// recursive
/*
int stepPerms(int n) {
    if( n == 1)
        return 1;
    
    if( n == 2)
        return 2;
    
    if( n == 3)
        return 4;
    
    return stepPerms( n - 1) + stepPerms( n - 2) + stepPerms( n - 3);
}
*/

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int s;
    cin >> s;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int s_itr = 0; s_itr < s; s_itr++) {
        int n;
        cin >> n;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        int res = stepPerms(n);

        fout << res << "\n";
    }

    fout.close();

    return 0;
}
