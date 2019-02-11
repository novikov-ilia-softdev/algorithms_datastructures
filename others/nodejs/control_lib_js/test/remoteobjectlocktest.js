var assert = require( "assert");

var channel = require( '../index');
var SubjectMock = require( './mock/subjectmock');

var session = channel.getSession();

describe( 'Remote Object Lock Unlock Test', function(){
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

	it( 'should lock', function( done){
		
		var remoteObjectName = "testObject";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);
		
		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, undefined);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			remoteObject.lock( function( err, res){
				assert.equal( err, null);
				assert.equal( res, true);
	
				done();
			});
		});
	});
	
	it( 'should multiple lock', function( done){
		
		var remoteObjectName1 = "testObject1";
		var remoteObjectName2 = "testObject2";
		var remoteObjectName3 = "testObject3";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);

		var remoteObject1 = session.getRemoteObject( remoteObjectName1, controlObject);
		var remoteObject2 = session.getRemoteObject( remoteObjectName2, controlObject);
		var remoteObject3 = session.getRemoteObject( remoteObjectName3, controlObject);
		
		assert.notEqual( remoteObject1, undefined);
		assert.notEqual( remoteObject2, undefined);
		assert.notEqual( remoteObject3, undefined);

		var lockReceived = 0;
		var lockExpected = 3;

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			remoteObject3.lock( function( err, res){
				assert.equal( err, null);
				assert.equal( res, true);
	
				lockReceived++;
				if( lockReceived == lockExpected)
					done();
			});

			remoteObject2.lock( function( err, res){
				assert.equal( err, null);
				assert.equal( res, true);
	
				lockReceived++;
				if( lockReceived == lockExpected)
					done();
			});

			remoteObject1.lock( function( err, res){
				assert.equal( err, null);
				assert.equal( res, true);
	
				lockReceived++;
				if( lockReceived == lockExpected)
					done();
			});
		});
	});
	
	it( 'should isLock', function( done){
		
		var remoteObjectName = "testObject";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);
		
		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, undefined);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			remoteObject.isLocked( function( err, res){
				assert.equal( err, null);
				assert.equal( res, true);
	
				done();
			});
		});
	});
	
	it( 'should tryLock', function( done){
		
		var remoteObjectName = "testObject";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);
		
		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, undefined);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			remoteObject.tryLock( function( err, res){
				assert.equal( err, null);
				assert.equal( res, true);
	
				done();
			});
		});
	});
	
	it( 'should unlock', function( done){
		
		var remoteObjectName = "testObject";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);
		
		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, undefined);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			remoteObject.unlock( function( err, res){
				assert.equal( err, null);
				assert.equal( res, true);
	
				done();
			});
		});
	});
});