var assert = require( "assert");

var channel = require( '../index');
var MessageSerializer = require( 'control_serialization_lib').MessageSerializer;
var SubjectMock = require( './mock/subjectmock');
var configHelper = require( '../lib/config/confighelper');

var EventHelper = require( "control_serialization_lib").EventHelper;

var session = channel.getSession();

describe( 'Remote Subject Test', function(){
	var subject;

	beforeEach( function( done){
		var path = configHelper.getSubject().path;
		var fs = require('fs');
		if( fs.existsSync(path))
			fs.unlinkSync(path);
		subject = new SubjectMock();
		session.start();
		subject.start( done);
	});
	
	afterEach( function(){
		session.stop();
		subject.stop();
	});

	it( 'should send event without data', function( done){
		
		var scriptType = "TestScript";
		var scriptId = "41242423234";
		
		var eventId = "SomeTestEvent";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		subject.once( 'event', function( event){
			assert.equal( event.sourceObject, controlObject.name);
			assert.equal( event.id, eventId);
			assert.equal( event.data, "");
			
			done();
		});

		remoteSubject.notify( controlObject.name, eventId);
	});
	
	it( 'should send event with data', function( done){
		
		var scriptType = "TestScript";
		var scriptId = "41242423234";
		
		var eventId = "SomeTestEvent";
		var eventData = "SomeEventData";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		subject.once( 'event', function( event){
			assert.equal( event.sourceObject, controlObject.name);
			assert.equal( event.id, eventId);
			assert.equal( event.data, eventData);
			
			done();
		});

		remoteSubject.notify( controlObject.name, eventId, eventData);
	});

	it( 'should send event with object data', function( done){
		
		var scriptType = "TestScript";
		var scriptId = "41242423234";
		
		var eventId = "SomeTestEvent";
		var eventData = { testField: "testValue"};
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		subject.once( 'event', function( event){
			assert.equal( event.sourceObject, controlObject.name);
			assert.equal( event.id, eventId);
			assert.equal( event.data, JSON.stringify(eventData));
			
			done();
		});

		remoteSubject.notify( controlObject.name, eventId, eventData);
	});

	it( 'should send Notification Subscribe', function( done){
		
		var scriptType = "TestScript";
		var scriptId = "41242423234";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		subject.once( 'subscribe', function( subscribe){
			assert.equal( subscribe.subscribeObject, controlObject.name);
			assert.equal( subscribe.del, false);
			done();
		});

        var events = [];
        events.push( EventHelper.createEvent());
		remoteSubject.subscribe( controlObject.name, events, function( err, res) {
			if ( err != null) return done( err);
		});
	});
	
	it( 'should receive Notification Subscribe Result', function( done){
		
		var scriptType = "TestScript";
		var scriptId = "41242423234";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

            var events = [];
            events.push( EventHelper.createEvent());

			remoteSubject.subscribe( controlObject.name, events, function( err, res) {
				if ( err != null) return done( err);
				done();
			});
		});
	});
	
	it( 'should send Notification Unsubscribe', function( done){
		
		var scriptType = "TestScript";
		var scriptId = "41242423234";

		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		subject.once( 'unsubscribe', function( unsubscribe){
			assert.equal( unsubscribe.subscribeObject, controlObject.name);
			assert.equal( unsubscribe.del, true);
			done();
		});

        var events = [];
        events.push( EventHelper.createEvent());
		remoteSubject.unsubscribe( controlObject.name, events, function(){});
	});

	it( 'should receive Notifications', function( done){
		
		var scriptType = "TestScript";
		var scriptId = "41242423234";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

            var events = [];
            events.push( EventHelper.createEvent());
			remoteSubject.subscribe( controlObject.name, events, function( err, subscribeResult, notification) {
				if ( err != null) return done( err);

				if( subscribeResult != null && subscribeResult.result)
					subject.sendNotification( controlObject.name, controlObject.conf);
				
				if( notification != null){
					messageSerializer = new MessageSerializer();
					var innerMessage = messageSerializer.parseFromBuffer( notification.message);
					assert.notEqual( innerMessage.messageId, null);
					assert.notEqual( innerMessage.call, null);
					done();
				};
				
			});
		});
	});
	
	it( 'should subscribe twice', function( done){
		var scriptType = "TestScript";
		var scriptId = "41242423234";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

            var events = [];
            events.push( EventHelper.createEvent());
			remoteSubject.subscribe( controlObject.name, events, function( err, res) {
				assert.equal( err, null);
				remoteSubject.subscribe( controlObject.name, events, function( err, res){
					done( err);
				});
			});
		});
	});
	
	it( 'should receive Notifications twice', function( done){
		
		var scriptType = "TestScript";
		var scriptId = "41242423234";
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);
		messageSerializer = new MessageSerializer();

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		var notificationCounter = 0;
		controlObject.init( function( err, res) {
			if ( err != null) return done( err);

            var events = [];
            events.push( EventHelper.createEvent());
			remoteSubject.subscribe( controlObject.name, events, function( err, subscribeResult, notification) {
				if ( err != null) return done( err);

				if( subscribeResult != null && subscribeResult.result){
					remoteSubject.subscribe( controlObject.name, events, function( err, res, notification){
						if ( err != null) return done( err);
						
						if( res != null && res.result)
							subject.sendNotification( controlObject.name, controlObject.conf);
						
						if( notification != null){
							isNotification(notification);
							assert.equal( notificationCounter, 2);
							done();
						};
					});
				}
				
				if( notification != null)
					isNotification(notification);
			});
		});
		
		function isNotification( notification){
			var innerMessage = messageSerializer.parseFromBuffer( notification.message);
			assert.notEqual( innerMessage.messageId, null);
			assert.notEqual( innerMessage.call, null);
			notificationCounter++;
		}
	});
});