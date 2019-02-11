var assert = require( "assert");

var channel = require( '../index');
var SubjectMock = require( './mock/subjectmock');
var errorHelper = channel.getErrorHelper();
var configHelper = require( '../lib/config/confighelper');

var session = channel.getSession();

describe( 'Control Object Get/Set Attributes Test', function(){
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

	it( "should not get not existed attribute", function( done){
		var scriptType = "TestScript";
		var scriptId = "293847";
		
		var boolAttributeName = "TestAttribute";

		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);
		
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			subject.on("resultError", function( resultError){
				assert.equal( resultError.sourceObject, controlObject.name);
				assert.equal( resultError.id, errorHelper.errors.noAttribute.id);
				done();
			});
			var dest = configHelper.getDynamicConf( controlObject.name);
			subject.getAttribute( controlObject.name, scriptId, boolAttributeName, dest, function( result){
			});
		});
	});

	it( "should not set not existed attribute", function( done){
		var scriptType = "TestScript";
		var scriptId = "293847";

		var boolAttributeName = "TestAttribute";
		var boolAttributeValue = true;
		
		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);
		
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			subject.on("resultError", function( resultError){
				assert.equal( resultError.sourceObject, controlObject.name);
				assert.equal( resultError.id, errorHelper.errors.noAttribute.id);
				done();
			});
			var dest = configHelper.getDynamicConf( controlObject.name);
			subject.setAttribute( controlObject.name, scriptId, boolAttributeName, boolAttributeValue, dest, function( result){
			});
		});
	});

	it( "should get bool attribute", function( done){
		var scriptType = "TestScript";
		var scriptId = "293847";
		
		var boolAttributeName = "TestAttribute";
		var boolAttributeValue = true;
		
		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);
		
		controlObject.addBoolAttribute( boolAttributeName, boolAttributeValue);
		
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			var dest = configHelper.getDynamicConf( controlObject.name);
			subject.getAttribute( controlObject.name, scriptId, boolAttributeName, dest, function( result){
				assert.equal( result.attributeName, boolAttributeName);
				assert.equal( result.attributeValue, boolAttributeValue);
				done();
			});
			
		});
	});

	it( "should get string attribute", function( done){
		var scriptType = "TestScript";
		var scriptId = "9697689";
		
		var stringAttributeName = "StringAttribute";
		var stringAttributeValue = "jklasdfhjlhas";

		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);
		
		controlObject.addStringAttribute( stringAttributeName, stringAttributeValue);
		
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			var dest = configHelper.getDynamicConf( controlObject.name);
			subject.getAttribute( controlObject.name, scriptId, stringAttributeName, dest, function( result){
				assert.equal( result.attributeName, stringAttributeName);
				assert.equal( result.attributeValue, stringAttributeValue);
				done();
			});
		});
	});
	
	it( "should set bool attribute", function( done){
		var scriptType = "TestScript";
		var scriptId = "3562345";
		
		var boolAttributeName = "TestAttribute";
		var boolAttributeValue = true;

		var newBoolAttributeValue = !boolAttributeValue;

		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);
		
		controlObject.addBoolAttribute( boolAttributeName, boolAttributeValue);
		
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			var dest = configHelper.getDynamicConf( controlObject.name);
			subject.setAttribute( controlObject.name, scriptId, boolAttributeName, newBoolAttributeValue, dest, function( result){
				subject.getAttribute( controlObject.name, scriptId, boolAttributeName, dest, function( result){
					assert.equal( result.attributeName, boolAttributeName);
					assert.equal( result.attributeValue, newBoolAttributeValue);
					done();
				});
			});
		});
	});

	it( "should set string attribute", function( done){
		var scriptType = "TestScript";
		var scriptId = "9697689";
		
		var stringAttributeName = "StringAttribute";
		var stringAttributeValue = "asdasdasd";

		var newStringAttributeValue = ";k;lklkasd";

		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);
		
		controlObject.addStringAttribute( stringAttributeName, stringAttributeValue);
		
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			var dest = configHelper.getDynamicConf( controlObject.name);
			subject.setAttribute( controlObject.name, scriptId, stringAttributeName, newStringAttributeValue, dest, function( result){
				subject.getAttribute( controlObject.name, scriptId, stringAttributeName, dest, function( result){
					assert.equal( result.attributeName, stringAttributeName);
					assert.equal( result.attributeValue, newStringAttributeValue);
					done();
				});
			});
		});
	});

	it( "should get function attribute", function( done){
		var scriptType = "TestScript";
		var scriptId = "5234523";
		
		var functionAttributeName = "FunctionAttribute";
		var functionAttributeValue = "aksdfl;asdfkl;";
		
		var functionAttributeGetCallback = function(){ return functionAttributeValue;};

		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);
		
		controlObject.addFunctionAttribute( functionAttributeName, null, functionAttributeGetCallback);
		
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			var dest = configHelper.getDynamicConf( controlObject.name);
			subject.getAttribute( controlObject.name, scriptId, functionAttributeName, dest, function( result){
				assert.equal( result.attributeName, functionAttributeName);
				assert.equal( result.attributeValue, functionAttributeValue);
				done();
			});
		});
	});

	it( "should set function attribute", function( done){
		var scriptType = "TestScript";
		var scriptId = "345345345";
		
		var functionAttributeName = "FunctionAttribute";
		var functionAttributeValue = "aksdfl;asdfkl;";
		
		var functionAttributeSetCallback = function( setAttributeValue){
			assert.equal( functionAttributeValue, setAttributeValue);
			done();
		};

		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);
		
		controlObject.addFunctionAttribute( functionAttributeName, functionAttributeSetCallback, null);
		
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			var dest = configHelper.getDynamicConf( controlObject.name);
			subject.setAttribute( controlObject.name, scriptId, functionAttributeName, functionAttributeValue, dest, function( result){
				assert.equal( result.attributeName, functionAttributeName);
			});
		});
	});

	it( "should get cached bool attribute", function( done){
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testBoolAttr";
		var attributeValue = true;
		var attributeCacheValue = false;
		var attributeCacheValueAsString = 0;

		var controlObject = session.createControlObject( scriptType, scriptId);
		assert.notEqual( controlObject, undefined);


		var voipControlObject = session.createControlObject( "VoipModule", "0");
		voipControlObject.addBoolAttribute( attributeName, attributeValue);

		var remoteObject = session.getRemoteObject( remoteObjectName, controlObject);
		assert.notEqual( remoteObject, null);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			voipControlObject.init( function( err, res){
				if ( err != null) return done( err);

				voipControlObject.cacheAttribute( attributeName, attributeCacheValue, function( err){
					if( err) done(err);
					//voipControlObject.setAttribute( attributeName, attributeValue);
					remoteObject.getAttr( attributeName, function( err, res){
						assert.equal( err, null);
						assert.equal( res, attributeCacheValueAsString);

						done();
					});
				});
			});
		});
	});

	it( "should get cached string attribute", function( done){
		var remoteObjectName = "VoipModule_0";
		var scriptType = "TestScript";
		var scriptId = "1234234234123";
		var attributeName = "testStringAttr";
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

				voipControlObject.cacheAttribute( attributeName, attributeCacheValue, function( err){
					if( err) done(err);
					voipControlObject.setAttribute( attributeName, attributeValue);
					remoteObject.getAttr( attributeName, function( err, res){
						assert.equal( err, null);
						assert.equal( res, attributeCacheValue);

						done();
					});
				});
			});
		});
	});

	it( "should get async attribute", function( done){
		var scriptType = "TestScript";
		var scriptId = "293847";

		var attributeName = "TestAttribute";
		var attributeValue = "TestAttributeValue";

		var controlObject = session.createControlObject( scriptType, scriptId);

		assert.notEqual( controlObject, null);

		controlObject.addAsyncGetter( attributeName, function( callback){
			callback( attributeValue);
		});

		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

			var dest = configHelper.getDynamicConf( controlObject.name);
			subject.getAttribute( controlObject.name, scriptId, attributeName, dest, function( result){
				assert.equal( result.attributeName, attributeName);
				assert.equal( result.attributeValue, attributeValue);
				done();
			});

		});
	});
});