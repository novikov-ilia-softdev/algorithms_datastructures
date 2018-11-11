#include <iostream>
#include <string>
#include <stack>
#include <set>
using namespace std;

bool isOpenBracket( char c){
    return ( c  == '{' || c  == '(' || c == '[' || c == '<');
}

bool isCloseBracket( char c, const stack<char>& st){
    
    if( c == '}' && !st.empty() && st.top() == '{')
        return true;

    if( c == ')' && !st.empty() && st.top() == '(')
        return true;

    if( c == ']' && !st.empty() && st.top() == '[')
        return true;

    if( c == '>' && !st.empty() && st.top() == '<')
        return true;

    return false;
}

bool isBalanced( const string& str){
    stack<char> st;
    set<char> openBracketsSet = {'(', '[', '{', '<'};
    set<char> closeBracketsSet = {')', ']', '}', '>'};

    for(int i = 0; i < str.length(); i++){
        if( openBracketsSet.find( str[i]) == openBracketsSet.end() &&
            closeBracketsSet.find( str[i]) == closeBracketsSet.end())
            continue;

        if( isOpenBracket( str[i])){
            st.push( str[i]);
            continue;
        }

        if( isCloseBracket( str[i], st)){
            st.pop();
            continue;
        }
        else
            return false;
    }

    return st.empty();
}

int main()
{
	string balancedStr = "{[]()}";
    cout << balancedStr << " is balanced: " << isBalanced( balancedStr) << endl;

    string nonBalancedStr = "{[(])}";
    cout << nonBalancedStr << " is balanced: " << isBalanced( nonBalancedStr) << endl;

    string nonBalancedStr2 = "{[}";
    cout << nonBalancedStr2 << " is balanced: " << isBalanced( nonBalancedStr2) << endl;

    string nonBalancedStr3 = "{dtt[dwed}wed";
    cout << nonBalancedStr3 << " is balanced: " << isBalanced( nonBalancedStr3) << endl;

    string balancedStr2 = "class Example { public do() { return; } }";
    cout << balancedStr2 << " is balanced: " << isBalanced( balancedStr2) << endl;

    string nonBalancedStr4 = "class Example { public do( { return; } }";
    cout << nonBalancedStr4 << " is balanced: " << isBalanced( nonBalancedStr4) << endl;

    string balancedStr5 = "class <Example> { public do() { return; } }";
    cout << balancedStr5 << " is balanced: " << isBalanced( balancedStr5) << endl;

    string nonBalancedStr6 = "class >Example< { public do( { return; } }";
    cout << nonBalancedStr6 << " is balanced: " << isBalanced( nonBalancedStr6) << endl;

	return 0;
}
