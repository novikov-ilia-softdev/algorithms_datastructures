#include <bits/stdc++.h>

using namespace std;

static uint32_t getKey(int lenA, int lenB) {

  //Max len == 1000, so 2^16 is more than enough to store it
  return ((static_cast<uint32_t>(lenA) << 16) |
    static_cast<uint32_t>(lenB));
}

typedef unordered_map<uint32_t, bool> MemoType;

static bool abbrev(const string &a, int lengthA,
  const string &b, int lengthB, MemoType *pMemo) {

  assert(nullptr != pMemo);

  const uint32_t key = getKey(lengthA, lengthB);
  if (0 < pMemo->count(key)) {
    return pMemo->at(key);
  }

  if (0 >= lengthA) {
    if (0 >= lengthB) {
      //An empty string is an abbreviation of other empty string
      (*pMemo)[key] = true; //Memoize calculated result
      return true;
    } else {
      //We have some missing uppercase letters in a from b
      (*pMemo)[key] = false; //Memoize calculated result
      return false;
    }
  } else {
    if (0 >= lengthB) {
      for (int i = 0; i < lengthA; ++i) {
        if (isupper(a[i])) {
          //We have at least one uppercase
          //letter in a missing from b
          (*pMemo)[key] = false; //Memoize calculated result
          return false;
        }
      }

      //a contains all lowercase letters which we can remove to make
      //resulting empty string an abbreviation of empty b string
      (*pMemo)[key] = true; //Memoize calculated result
      return true;
    } //else both strings are non empty and will be analyzed below
  }

  assert((0 < lengthA) && (0 < lengthB));

  if (b[lengthB - 1] == a[lengthA - 1]) {
    const int lenA = lengthA - 1;
    const int lenB = lengthB - 1;
    const bool res = abbrev(a, lenA, b, lenB, pMemo);
    (*pMemo)[getKey(lenA, lenB)] = res; //Memoize calculated result
    return res;

  } else if (b[lengthB - 1] == toupper(a[lengthA - 1])) {

    const int lenA = lengthA - 1;
    int lenB = lengthB - 1;
    bool res = abbrev(a, lenA, b, lenB, pMemo);
    (*pMemo)[getKey(lenA, lenB)] = res; //Memoize calculated result

    if (res) {
      return true;
    }

    //OR

    lenB = lengthB;
    res = abbrev(a, lenA, b, lenB, pMemo);
    (*pMemo)[getKey(lenA, lenB)] = res; //Memoize calculated result
    return res;

  } else if (isupper(a[lengthA - 1])) {

    (*pMemo)[key] = false; //Memoize calculated result
    return false;

  } else {

    const int lenA = lengthA - 1;
    const int lenB = lengthB;
    const bool res = abbrev(a, lenA, b, lenB, pMemo);
    (*pMemo)[getKey(lenA, lenB)] = res; //Memoize calculated result
    return res;
  }
}

string abbreviation(string a, string b) {

  MemoType memo;

  return ((abbrev(a, a.length(), b, b.length(), &memo)) ? "YES" : "NO");
}
int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int q;
    cin >> q;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int q_itr = 0; q_itr < q; q_itr++) {
        string a;
        getline(cin, a);

        string b;
        getline(cin, b);

        string result = abbreviation(a, b);

        fout << result << "\n";
    }

    fout.close();

    return 0;
}
