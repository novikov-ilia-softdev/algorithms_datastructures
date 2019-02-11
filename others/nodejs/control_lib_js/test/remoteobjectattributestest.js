var assert = require( "assert");

var channel = require( '../index');
var SubjectMock = require( './mock/subjectmock');
var errorHelper = channel.getErrorHelper();
var configHelper = require( '../lib/config/confighelper');

var Message = require( 'control_serialization_lib').Message;

var session = channel.getSession();

describe( 'Remote Object Work With Attributes Test', function(){
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

	it( 'should not get not existed attribute', function( done){
		
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testAttr";
		
		subject.addNoAttributeErrorCO( remoteObjectName);

		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, null);

		var voipControlObject = session.createControlObject( "VoipModule", "0");
		
		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, undefined);
		
		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);
				
				remoteObject.getAttr( attributeName, function( err, res){
					assert.notEqual( err, null);
					assert.equal( err.sourceObject, remoteObjectName);
					assert.equal( err.id, errorHelper.errors.noAttribute.id);

					done();
				});
			});
		});
	});

	it( 'should not set not existed attribute', function( done){
		
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testAttr";
		var attributeValue = "testAttr";
		
		subject.addNoAttributeErrorCO( remoteObjectName);

		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);
		
		var voipControlObject = session.createControlObject( "VoipModule", "0");

		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, null);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);
			
			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);
				
				remoteObject.setAttr( attributeName, attributeValue, function( err, res){
					assert.notEqual( err, null);
					assert.equal( err.sourceObject, remoteObjectName);
					assert.equal( err.id, errorHelper.errors.noAttribute.id);

					done();
				});
			});
		});
	});

	it( 'should get attribute', function( done){
		
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testAttr";
		var attributeValue = "attributeValue";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);
		
		var voipControlObject = session.createControlObject( "VoipModule", "0");
		voipControlObject.addStringAttribute( attributeName, attributeValue);

		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, null);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);
			
			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);
				
				remoteObject.getAttr( attributeName, function( err, res){
					assert.equal( err, null);
					assert.equal( res, attributeValue);
		
					done();
				});
			});
		});
	});
	
	it( 'should set attribute', function( done){
		
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testAttr";
		var attributeValue = "testAttr";

		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);
		
		var voipControlObject = session.createControlObject( "VoipModule", "0");
		voipControlObject.addStringAttribute( attributeName);

		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, null);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);
			
			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);
				
				remoteObject.setAttr( attributeName, attributeValue, function( err, res){
					assert.equal( err, null);
					assert.equal( res, attributeValue);
					done();
				});
			});
		});
	});
	
	it( 'should get attribute with acl', function( done){
		
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testAttr";
		var attributeValue = "attributeValue";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);
		
		var voipControlObject = session.createControlObject( "VoipModule", "0");
		voipControlObject.addStringAttribute( attributeName, attributeValue);
		
		var aclMessage = new Message( configHelper.getSubjectName());
		aclMessage.createCall( remoteObjectName);
		aclMessage.call.createAccessControlList( controlObject.name, scriptId, true);
		subject.sendMessage( configHelper.getConfByName( remoteObjectName), aclMessage);

		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, null);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);
			
			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);
				
				remoteObject.getAttr( attributeName, function( err, res){
					assert.equal( err, null);
					assert.equal( res, attributeValue);
		
					done();
				});
			});
		});
	});
	
	it( 'should set attribute with acl', function( done){
		
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testAttr";
		var attributeValue = "testAttr";

		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);
		
		var voipControlObject = session.createControlObject( "VoipModule", "0");
		voipControlObject.addStringAttribute( attributeName);
		
		var aclMessage = new Message( configHelper.getSubjectName());
		aclMessage.createCall( remoteObjectName);
		aclMessage.call.createAccessControlList( controlObject.name, scriptId, true);
		subject.sendMessage( configHelper.getConfByName( remoteObjectName), aclMessage);

		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, null);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);
			
			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);
				
				remoteObject.setAttr( attributeName, attributeValue, function( err, res){
					assert.equal( err, null);
					assert.equal( res, attributeValue);

					done();
				});
			});
		});
	});
	
	it( 'should get access denied error on get', function( done){
		
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testAttr";
		
		subject.addNoAttributeErrorCO( remoteObjectName);

		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, null);

		var voipControlObject = session.createControlObject( "VoipModule", "0");
		voipControlObject.addStringAttribute( attributeName);
		
		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);
				var aclMessage = new Message( configHelper.getSubjectName());
				aclMessage.createCall( remoteObjectName);
				aclMessage.call.createAccessControlList( "OtherCO", "OtherScript", true);
				subject.sendMessage( configHelper.getConfByName( remoteObjectName), aclMessage);

				var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
				assert.notEqual( remoteObject, undefined);
				
				remoteObject.getAttr( attributeName, function( err, res){
					assert.notEqual( err, null);
					assert.equal( err.sourceObject, remoteObjectName);
					assert.equal( err.id, errorHelper.errors.accessDenied.id);

					done();
				});
			});
		});
	});
	
	it( 'should get access denied error on set', function( done){
		
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testAttr";
		
		subject.addNoAttributeErrorCO( remoteObjectName);

		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, null);

		var voipControlObject = session.createControlObject( "VoipModule", "0");
		voipControlObject.addStringAttribute( attributeName);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);

				var aclMessage = new Message( configHelper.getSubjectName());
				aclMessage.createCall( remoteObjectName);
				aclMessage.call.createAccessControlList( "OtherCO", "OtherScript", true);
				subject.sendMessage( configHelper.getConfByName( remoteObjectName), aclMessage);

				var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
				assert.notEqual( remoteObject, undefined);

				remoteObject.setAttr( attributeName, "1", function( err, res){
					assert.notEqual( err, null);
					assert.equal( err.sourceObject, remoteObjectName);
					assert.equal( err.id, errorHelper.errors.accessDenied.id);

					done();
				});
			});
		});
	});

	it( 'should get cached attribute', function( done){

		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testAttr";
		var attributeValue = "attributeValue";
		var attributeCacheValue = "attributeCacheValue";

		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);


		var voipControlObject = session.createControlObject( "VoipModule", "0");
		voipControlObject.addStringAttribute( attributeName, attributeValue);

		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, null);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);

				voipControlObject.controlCacher.cacheAttribute( voipControlObject.name, attributeName, attributeCacheValue, function( err){
					if( err) done(err);
					remoteObject.getAttr( attributeName, function( err, res){
						assert.equal( err, null);
						assert.equal( res, attributeCacheValue);

						done();
					});
				});


			});
		});
	});
});