#include <bits/stdc++.h>

using namespace std;

string problemA = "rREERreeeeRreReeeeeEErRRrrererreRreReeereRrerreRrREEeReEErrrreeErEeReRrrerrrEreereereeRrEeRrreREeeerEReREerrrrreerErEErrrrRErrrRrreeReReereERerereReRreEeeeeEEeerrrerRrrrrRerreeeEEereeereeEeeEseeReEreRRERrrrereerrererrEReerrrrrreeeRrreeeeeRRrsrrREererERRreereeRereEeRrRrRereEeeeRreEeerrRrereRerrrerererErRererrreeEeRRrErErrErrerrrreerrrreReeererersreReerEreRerReRRreEeeReereeEerrEEErrrEererreeerreeerrrrrEeeEEerrrReReeerreeREeEeREeReeeeREeRerERerreRereeslrrreeerERerErrRreRRrreEeererrrRRRreErrRREreeEeereeerrreeerrEerrrRRrerrerRReErRRrreEeeRereeEeERreEeEerREErReReRerrrreeERErereRreeReeeeeeErrreeerEeerEREeeReereerrrrerrErerrErerRrrErerrReEEerReeERRRrErereeeerERerRrRErSeEeeeeRrEereeeErrrREerERerReeeeReerRrreeEEeEerrereeeererEEERseeererRrrRerreersereeeRrreeEerrrrrreRERrErerrreRrrererRerererRreErEErrRrREreRrRrerReEeRrErrerererrreerreEReeRererrreReEEererREeEvRRrrer";

string problemB = "EREEEERRRRRRREREEEREERRRREERRERRREEERRERREEEEERRRRERRRREEERRRREEEEEEERRRRREEEEEEEEEEESRERRERRRRRERRRERRRRRREREREEREERRRREREEREERRRERERRREERREERERRERRRESERERRRERREREEEEEEREERERREEREEEERREREEEREEERERRERRERREEEEERERRRRREERRRREERRRREEERERREEERRRRRERRREREEEREEEREERREREREEREEREEEERREEREEEREREEREERERRERRERRREEEERREERRREREERERRRERSEEEEREERERREERERERREEEREEREEERSERRREREEERREERRRRERERREERERERREEREERRRERRREEREEEREEREERERREEEEREEERRR";

string problemX = "RrerrErEReeerrrrrReEreerReerRerREERreeeeRreReeeeeEErRRrrererreRreReeereRrerreRrREEeReEErrrreeErEeReRrrerrrEreereereeRrEeRrreREeeerEReREerrrrreerErEErrrrRErrrRrreeReReereERerereReRreEeeeeEEeerrrerRrrrrRerreeeEEereeereeEeeEseeReEreRRERrrrereerrererrEReerrrrrreeeRrreeeeeRRrsrrREererERRreereeRereEeRrRrRereEeeeRreEeerrRrereRerrrerererErRererrreeEeRRrErErrErrerrrreerrrreReeererersreReerEreRerReRRreEeeReereeEerrEEErrrEererreeerreeerrrrrEeeEEerrrReReeerreeREeEeREeReeeeREeRerERerreRereeslrrreeerERerErrRreRRrreEeererrrRRRreErrRREreeEeereeerrreeerrEerrrRRrerrerRReErRRrreEeeRereeEeERreEeEerREErReReRerrrreeERErereRreeReeeeeeErrreeerEeerEREeeReereerrrrerrErerrErerRrrErerrReEEerReeERRRrErereeeerERerRrRErSeEeeeeRrEereeeErrrREerERerReeeeReerRrreeEEeEerrereeeererEEERseeererRrrRerreersereeeRrreeEerrrrrreRERrErerrreRrrererRerererRreErEErrRrREreRrRrerReEeRrErrerererrreerreEReeRererrreReEEererREeEvRRrrer";

string problemParent = "rrerrErEReeerrrrrReEreerReerRerREERreeeeRreReeeeeEErRRrrererreRreReeereRrerreRrREEeReEErrrreeErEeReRrrerrrEreereereeRrEeRrreREeeerEReREerrrrreerErEErrrrRErrrRrreeReReereERerereReRreEeeeeEEeerrrerRrrrrRerreeeEEereeereeEeeEseeReEreRRERrrrereerrererrEReerrrrrreeeRrreeeeeRRrsrrREererERRreereeRereEeRrRrRereEeeeRreEeerrRrereRerrrerererErRererrreeEeRRrErErrErrerrrreerrrreReeererersreReerEreRerReRRreEeeReereeEerrEEErrrEererreeerreeerrrrrEeeEEerrrReReeerreeREeEeREeReeeeREeRerERerreRereeslrrreeerERerErrRreRRrreEeererrrRRRreErrRREreeEeereeerrreeerrEerrrRRrerrerRReErRRrreEeeRereeEeERreEeEerREErReReRerrrreeERErereRreeReeeeeeErrreeerEeerEREeeReereerrrrerrErerrErerRrrErerrReEEerReeERRRrErereeeerERerRrRErSeEeeeeRrEereeeErrrREerERerReeeeReerRrreeEEeEerrereeeererEEERseeererRrrRerreersereeeRrreeEerrrrrreRERrErerrreRrrererRerererRreErEErrRrREreRrRrerReEeRrErrerererrreerreEReeRererrreReEEererREeEvRRrrer";

string makeKey( string a, string b){
    return a + "_" + b;
}

bool isPossibleToTransform(string a, string b, int depth, int reason){
    
    static int count = 0;
    count++;
    
    int callId = rand();
    
    static set<string> visited;
    static map<string, bool> m;
    
    if( m.count( makeKey(a, b)) != 0)
	return m[ makeKey(a, b)];
    
    /*
    if( visited.find( makeKey( a, b)) != visited.end()){
	cout << "a: " << a << endl;
	cout << "a.size(): " << a.size() << endl;    
	cout << "b: " << b << endl;
	cout << "b.size(): " << b.size() << endl;
	cout << "depth: " << depth << endl;
	cout << "reason: " << reason << endl;
	cout << "count: " << count << endl;
	cout << endl;
	cin.get();
    }
    visited.insert( makeKey( a, b));
    */
    
    if( a.empty() && b.empty()){
	//cout << "1: 1" << endl;
	m[ makeKey(a, b)] = true;
	return true;
    }
	
          
    if( a.empty() && !b.empty()){
	//cout << "2: 0" << endl;
	m[ makeKey(a, b)] = false;
	return false;
    }
	
        
    if( !a.empty() && b.empty()){
        if( isupper( a[0])){
	    //cout << "3: 0" << endl;
	    m[ makeKey(a, b)] = false;
	    return false;
	}
	    
	//cout << "1 (" << callId << "): " << endl;
	bool res = isPossibleToTransform( a.substr( 1), b, depth + 1, 1);
	m[ makeKey(a, b)] = res;
	return res;
    }
        
    if( islower( a[0])){
	string copyA = a;
	//cout << "2 (" << callId << "): " << endl;
	copyA[ 0] = toupper( copyA[0]);
	
	if( isPossibleToTransform( copyA, b, depth + 1, 2)){
	    //cout << "4: 1" << endl;
	    m[ makeKey(copyA, b)] = true;
	    return true;
	}
	    
	
	//cout << "3 (" << callId << "): " << endl;
        if( isPossibleToTransform( a.substr( 1), b, depth + 1, 3)){
	    //cout << "5: 1" << endl;
	    m[ makeKey(a.substr( 1), b)] = true;
	    return true;
	}
            
        
	//cout << "6: 0" << endl;
	m[ makeKey(a, b)] = false;
        return false;
    }
    
    if( isupper( a[ 0]) && isupper( b[ 0]) && a[ 0] == b[ 0]){
	//cout << "4 (" << callId << "): " << endl;
	bool res = isPossibleToTransform( a.substr( 1), b.substr( 1), depth + 1, 4);
	m[ makeKey(a, b)] = res;
	return res;
    }
	
    //cout << "7: 0" << endl;
    m[ makeKey(a, b)] = false;
    return false;
}

string abbreviation(string a, string b) {
    
    if( isPossibleToTransform( a, b, 0, 0)){
        //cout << "YES" << endl;
        return "YES";
    }
        
    //cout << "NO" << endl;
    return "NO";
}

int main()
{
    srand (time(NULL));
    
    ofstream fout(getenv("OUTPUT_PATH"));
    ifstream fin("input12_4.txt");
    
    int q;
    fin >> q;
    fin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int q_itr = 0; q_itr < q; q_itr++) {
        string a;
        getline(fin, a);

        string b;
        getline(fin, b);

        string result = abbreviation(a, b);

        fout << result << "\n";
    }

    fout.close();

    return 0;
}
