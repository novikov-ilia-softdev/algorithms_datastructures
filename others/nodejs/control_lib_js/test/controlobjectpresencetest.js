var assert = require( "assert");

var channel = require( '../index');
var SubjectMock = require( './mock/subjectmock');
var configHelper = require( '../lib/config/confighelper');

var session = channel.getSession();

describe( 'Control Object Presence Test', function(){
	var subject;

	beforeEach( function( done){
		subject = new SubjectMock();
		session.start();
		subject.start( done);
	});

	afterEach( function(){
		session.stop();
		subject.stop();
	});

	it( "should send hello", function( done){
		var scriptType = "TestScript";
		var scriptId = "293847";
		
		var boolAttributeName = "TestAttribute";

		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);

		subject.on( "presenceHello", function( count){
			if( count >= 2){
				assert.equal( 2, count);
				done();
			}
		});
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);
		});
	}).timeout(11000);

	it( "should send bye", function( done){
		var scriptType = "TestScript";
		var scriptId = "293847";

		var boolAttributeName = "TestAttribute";

		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);

		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			subject.on( "presenceBye", function(){
				done();
			});

			controlObject.sendPresenceBye();
		});
	});
});