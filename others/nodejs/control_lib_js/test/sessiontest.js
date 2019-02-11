var assert = require( "assert");

var channel = require( '../index');
var controlObjectNameHelper = require( '../lib/control/controlobjectnamehelper.js');

var session = channel.getSession();

describe( 'Control Object Test', function(){
	beforeEach( function(){
		session.start();
	});
	
	afterEach( function(){
        session.stop();
	});

	it( 'should create and get ControlObjects', function(){
		
		var scriptType = "TestScript";
		var scriptId = "41242423234";
		
		var createdScriptControlObject = session.createControlObject( scriptType, scriptId);
		var createdVoipControlObject = session.createControlObject( controlObjectNameHelper.names.voip);

		var gottenScriptControlObject = session.getControlObject( scriptType, scriptId);
		var gottenVoipControlObject = session.getControlObject( controlObjectNameHelper.names.voip);

		var remoteSubject = session.getRemoteSubject( createdScriptControlObject);

		assert.notEqual( createdScriptControlObject, null);
		assert.notEqual( createdVoipControlObject, null);

		assert.notEqual( gottenScriptControlObject, null);
		assert.notEqual( gottenVoipControlObject, null);

		assert.notEqual( remoteSubject, null);
	});
	
});