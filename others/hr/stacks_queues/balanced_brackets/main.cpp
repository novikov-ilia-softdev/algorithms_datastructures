#include <bits/stdc++.h>

#include <stack>
using namespace std;

// Complete the isBalanced function below.
string isBalanced(string s) {
    stack<char> st;
    for( int i = 0; i < s.length(); i++)
    {
        if( s[ i] == '[' || s[ i] == '(' || s[ i] == '{'){
            //std::cout << "push " << s[i] << std::endl;
            st.push( s[ i]);
            continue;
        }
            
        if( s[i] == ']'){
            if( !st.empty() && st.top() == '['){
                //std::cout << "pop [" << std::endl;
                st.pop();
                continue;
            }
            else{
                return "NO";
                break;
            }
        }
        
        if( s[i] == ')'){
            if( !st.empty() && st.top() == '('){
                //std::cout << "pop (" << std::endl;
                st.pop();
                continue;
            }
            else{
                return "NO";
                break;
            }
        }
        
        if( s[i] == '}'){
            if( !st.empty() && st.top() == '{'){
                //std::cout << "pop {" << std::endl;
                st.pop();
                continue;
            }
            else{
                return "NO";
                break;
            }
        }
    }
    
    //std::cout << "empty" << std::endl;
    if( !st.empty())
        return "NO";
    
    return "YES";
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int t;
    cin >> t;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int t_itr = 0; t_itr < t; t_itr++) {
        string s;
        getline(cin, s);

        string result = isBalanced(s);

        fout << result << "\n";
    }

    fout.close();

    return 0;
}
