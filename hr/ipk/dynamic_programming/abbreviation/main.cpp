#include <bits/stdc++.h>

using namespace std;

string problemA = "rREERreeeeRreReeeeeEErRRrrererreRreReeereRrerreRrREEeReEErrrreeErEeReRrrerrrEreereereeRrEeRrreREeeerEReREerrrrreerErEErrrrRErrrRrreeReReereERerereReRreEeeeeEEeerrrerRrrrrRerreeeEEereeereeEeeEseeReEreRRERrrrereerrererrEReerrrrrreeeRrreeeeeRRrsrrREererERRreereeRereEeRrRrRereEeeeRreEeerrRrereRerrrerererErRererrreeEeRRrErErrErrerrrreerrrreReeererersreReerEreRerReRRreEeeReereeEerrEEErrrEererreeerreeerrrrrEeeEEerrrReReeerreeREeEeREeReeeeREeRerERerreRereeslrrreeerERerErrRreRRrreEeererrrRRRreErrRREreeEeereeerrreeerrEerrrRRrerrerRReErRRrreEeeRereeEeERreEeEerREErReReRerrrreeERErereRreeReeeeeeErrreeerEeerEREeeReereerrrrerrErerrErerRrrErerrReEEerReeERRRrErereeeerERerRrRErSeEeeeeRrEereeeErrrREerERerReeeeReerRrreeEEeEerrereeeererEEERseeererRrrRerreersereeeRrreeEerrrrrreRERrErerrreRrrererRerererRreErEErrRrREreRrRrerReEeRrErrerererrreerreEReeRererrreReEEererREeEvRRrrer";

string problemB = "EREEEERRRRRRREREEEREERRRREERRERRREEERRERREEEEERRRRERRRREEERRRREEEEEEERRRRREEEEEEEEEEESRERRERRRRRERRRERRRRRREREREEREERRRREREEREERRRERERRREERREERERRERRRESERERRRERREREEEEEEREERERREEREEEERREREEEREEERERRERRERREEEEERERRRRREERRRREERRRREEERERREEERRRRRERRREREEEREEEREERREREREEREEREEEERREEREEEREREEREERERRERRERRREEEERREERRREREERERRRERSEEEEREERERREERERERREEEREEREEERSERRREREEERREERRRRERERREERERERREEREERRRERRREEREEEREEREERERREEEEREEERRR";

string problemX = "RrerrErEReeerrrrrReEreerReerRerREERreeeeRreReeeeeEErRRrrererreRreReeereRrerreRrREEeReEErrrreeErEeReRrrerrrEreereereeRrEeRrreREeeerEReREerrrrreerErEErrrrRErrrRrreeReReereERerereReRreEeeeeEEeerrrerRrrrrRerreeeEEereeereeEeeEseeReEreRRERrrrereerrererrEReerrrrrreeeRrreeeeeRRrsrrREererERRreereeRereEeRrRrRereEeeeRreEeerrRrereRerrrerererErRererrreeEeRRrErErrErrerrrreerrrreReeererersreReerEreRerReRRreEeeReereeEerrEEErrrEererreeerreeerrrrrEeeEEerrrReReeerreeREeEeREeReeeeREeRerERerreRereeslrrreeerERerErrRreRRrreEeererrrRRRreErrRREreeEeereeerrreeerrEerrrRRrerrerRReErRRrreEeeRereeEeERreEeEerREErReReRerrrreeERErereRreeReeeeeeErrreeerEeerEREeeReereerrrrerrErerrErerRrrErerrReEEerReeERRRrErereeeerERerRrRErSeEeeeeRrEereeeErrrREerERerReeeeReerRrreeEEeEerrereeeererEEERseeererRrrRerreersereeeRrreeEerrrrrreRERrErerrreRrrererRerererRreErEErrRrREreRrRrerReEeRrErrerererrreerreEReeRererrreReEEererREeEvRRrrer";

bool isPossibleToTransform(string a, string b, string fromA){
    
    int callId = rand();
    
    //cout << "a: " << a << endl;
    //cout << a.size() << endl;
    //cout << "b: " << b << endl;
    //cout << endl;
      
    if( a == problemX ){
	cout << "WOW" << endl;
	cout << origin << endl;
	//cin.get();
    }
    
    if( a.empty() && b.empty())
	return true;
          
    if( a.empty() && !b.empty())
	return false;
        
    if( !a.empty() && b.empty()){
        if( isupper( a[0]))
	    return false;
        
	//cout << "1 (" << callId << "): " << a << endl;
        return isPossibleToTransform( a.substr( 1), b, a);
    }
        
    if( islower( a[0])){
	
	//cout << "2 (" << callId << "): " << a << endl;
	a[ 0] = toupper( a[0]);
	
	if( isPossibleToTransform( a, b, a))
	    return true;
	
	//cout << "3 (" << callId << "): " << a << endl;
        if( isPossibleToTransform( a.substr( 1), b, a))
            return true;
        
        return false;
    }
    
    if( a[ 0] == b[ 0]){
	//cout << "4 (" << callId << "): " << a << endl;
	return isPossibleToTransform( a.substr( 1), b.substr( 1), a);
    }
	
    return false;
}

string abbreviation(string a, string b) {
    
    if( isPossibleToTransform( a, b, a)){
        cout << "YES" << endl;
        return "YES";
    }
        
    cout << "NO" << endl;
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
