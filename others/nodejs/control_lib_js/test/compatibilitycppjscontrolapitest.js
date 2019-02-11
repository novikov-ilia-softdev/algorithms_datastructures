var assert = require( "assert");
var exec = require('child_process').exec;

var channel = require( '../index');
var id = require( '../lib/id/id');

var MessageSerializer = require( 'control_serialization_lib').MessageSerializer;

var session = channel.getSession();

function strToBool( str) {
	var result = ( str == "false" || str == "0" || str.length > 0) ? false : str;
	result = ( str == "true" || str == "1") ? true : result;

	return Boolean( result);
}

function runScript( scriptPath, args, callback){
    var child;
    var argsStr = ""
    for( var i = 0; i < args.length; i++)
    	argsStr+= " " + args[i];
	var runScriptCommand = 'node ' + __dirname + scriptPath + argsStr;
	child = exec( runScriptCommand, args, callback);
}

describe( 'Compatibility CPP Control api and JavaScript Control api Test', function(){
	try{
		var controlMock = require( 'controlmock');
	}
	catch( e){
		console.warn( e);
		return;
	}

	beforeEach( function(){
		session.start();
	});
	
	afterEach( function(){
        session.stop();
	});

	it( 'should JS send and CPP receive event', function( done){
		
		var scriptType = "TestScript";
		var scriptId = id.generate();
		
		var eventId = "SomeTestEvent";

		var controlObject = session.createControlObject( scriptType, scriptId);
        assert.notEqual( controlObject, null);

		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( remoteSubject, null);

		runScript( '/mock/cppsubjectcallsreceiver.js', ["isEventReceived"], function( err, res){
			assert.equal( err, null);
		    assert.equal( strToBool( res), true);
		    done();
		});

        controlObject.init( function(){
            setTimeout( function(){
                remoteSubject.notify( controlObject.name, eventId, null, function(){
                });
            }, 200);
        });
	});

	it( 'should JS send and CPP receive Notification Subscribe', function( done){
		
		var scriptType = "TestScript";
		var scriptId = id.generate();
		
		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);

		runScript( '/mock/cppsubjectcallsreceiver.js', ["isAddNotificationHandlerReceived"], function( err, res){
			assert.equal( err, null);
		    assert.equal( strToBool( res), true);
		    done();
		});
		
		setTimeout( function(){
			remoteSubject.subscribe( controlObject.name);
		}, 100);
	});
	
	it( 'should JS send and CPP receive Notification Unsubscribe', function( done){
		
		var scriptType = "TestScript";
		var scriptId = id.generate();

		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteSubject = session.getRemoteSubject( controlObject);

		assert.notEqual( controlObject, null);
		assert.notEqual( remoteSubject, null);
		
		runScript( '/mock/cppsubjectcallsreceiver.js', ["isDelNotificationHandlerReceived"], function( err, res){
			assert.equal( err, null);
		    assert.equal( strToBool( res), true);
		    done();
		});

		setTimeout( function(){
			remoteSubject.unsubscribe( controlObject.name, function(){});
		}, 100);
	});
	
	it( 'should JS send and CPP receive lock', function( done){
		
		var isResult = false;
		var scriptType = "TestScript";
		var scriptId = id.generate();

		var remoteScriptType = "TestScript";
		var remoteScriptId = id.generate();

		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteControlObject = session.createControlObject( remoteScriptType, remoteScriptId);
		
		assert.notEqual( controlObject, undefined);
		
		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			var remoteObject = session.getRemoteObject( remoteControlObject.name, controlObject);
			assert.notEqual( remoteObject, undefined);

			runScript( '/mock/cppsubjectcallsreceiver.js', ["isLock"], function( err, res){
				assert.equal( err, null);
			    assert.equal( strToBool( res), true);
			    if( isResult)
			    	done();
			});

			setTimeout( function(){
				remoteObject.lock( function( err, res){
					assert.equal( err, null);
					assert.equal( res, true);

					isResult = true;
				});
			}, 1000);
		});
	});

	
	it( 'should JS send and CPP receive unlock', function( done){
		
		var isResult = false;
		var scriptType = "TestScript";
		var scriptId = id.generate();

		var remoteScriptType = "TestScript";
		var remoteScriptId = id.generate();

		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteControlObject = session.createControlObject( remoteScriptType, remoteScriptId);

		assert.notEqual( controlObject, undefined);
		
		var remoteObject = session.getRemoteObject( remoteControlObject.name, controlObject);
		assert.notEqual( remoteObject, undefined);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			runScript( '/mock/cppsubjectcallsreceiver.js', ["isUnlock"], function( err, res){
				assert.equal( err, null);
			    assert.equal( strToBool( res), true);
			    if( isResult)
			    	done();
			});

			setTimeout( function(){
				remoteObject.unlock( function( err, res){
					assert.equal( err, null);
					assert.equal( res, true);
		
					isResult = true;
				});
			}, 100);
		});
	});

	it( 'should JS send and CPP receive isLock', function( done){
		
		var isResult = false;
		var scriptType = "TestScript";
		var scriptId = id.generate();

		var remoteScriptType = "TestScript";
		var remoteScriptId = id.generate();

		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteControlObject = session.createControlObject( remoteScriptType, remoteScriptId);

		assert.notEqual( controlObject, undefined);
		
		var remoteObject = session.getRemoteObject( remoteControlObject.name, controlObject);
		assert.notEqual( remoteObject, undefined);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			runScript( '/mock/cppsubjectcallsreceiver.js', ["isIsLock"], function( err, res){
				assert.equal( err, null);
			    assert.equal( strToBool( res), true);
			    if( isResult)
			    	done();
			});

			setTimeout( function(){
				remoteObject.isLocked( function( err, res){
					assert.equal( err, null);
					assert.equal( res, true);
		
					isResult = true;
				});
			}, 100);
		});
	});

	it( 'should JS send and CPP receive tryLock', function( done){
		
		var isResult = false;
		var scriptType = "TestScript";
		var scriptId = id.generate();

		var remoteScriptType = "TestScript";
		var remoteScriptId = id.generate();

		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteControlObject = session.createControlObject( remoteScriptType, remoteScriptId);

		assert.notEqual( controlObject, undefined);
		
		var remoteObject = session.getRemoteObject( remoteControlObject.name, controlObject);
		assert.notEqual( remoteObject, undefined);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			runScript( '/mock/cppsubjectcallsreceiver.js', ["isTryLock"], function( err, res){
				assert.equal( err, null);
			    assert.equal( strToBool( res), true);
			    if( isResult)
			    	done();
			});

			setTimeout( function(){
				remoteObject.tryLock( function( err, res){
					assert.equal( err, null);
					assert.equal( res, true);
		
					isResult = true;
				});
			}, 100);
		});
	});

	it( 'should JS send and CPP receive Set Attribute', function( done){
		
		var isResult = false;
		var scriptType = "TestScript";
		var scriptId = id.generate();

		// Теперь атрибуты устанавливаются напрямую, но в тестах будем устанавливать их Субъекту
		var remoteScriptType = "Subject";
		var remoteScriptId = "0";

		var attributeName = "testAttr";
		var attributeValue = "testAttr";

		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteControlObject = session.createControlObject( remoteScriptType, remoteScriptId);

		assert.notEqual( controlObject, undefined);
		
		var remoteObject = session.getRemoteObject( remoteControlObject.name, controlObject);
		assert.notEqual( remoteObject, undefined);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			runScript( '/mock/cppsubjectcallsreceiver.js', ["isSet"], function( err, res){
				assert.equal( err, null);
			    assert.equal( strToBool( res), true);
			    if( isResult)
			    	done();
			});

			setTimeout( function(){
				remoteObject.setAttr( attributeName, attributeValue, function( err, res){
					
					assert.equal( err, null);
					assert.equal( res, attributeValue);
		
					isResult = true;
				});
			}, 100);
		});
	});


	it( 'should JS send and CPP receive Get Attribute', function( done){
		
		var isResult = false;
		var scriptType = "TestScript";
		var scriptId = id.generate();

		var remoteScriptType = "Subject";
		var remoteScriptId = "0";

		var attributeName = "testAttr";

		var controlObject = session.createControlObject( scriptType, scriptId);
		var remoteControlObject = session.createControlObject( remoteScriptType, remoteScriptId);

		assert.notEqual( controlObject, undefined);
		
		var remoteObject = session.getRemoteObject( remoteControlObject.name, controlObject);
		assert.notEqual( remoteObject, undefined);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			runScript( '/mock/cppsubjectcallsreceiver.js', ["isGet"], function( err, res){
				assert.equal( err, null);
			    assert.equal( strToBool( res), true);
			    if( isResult)
			    	done();
			});

			setTimeout( function(){
				remoteObject.getAttr( attributeName, function( err, res){
					assert.equal( err, null);
					assert.equal( res, "1");
		
					isResult = true;
				});
			}, 100);
		});
	});
	
	it( 'should CPP send and JS receive Get Attribute and send Result', function( done){
		
		var attributeName = "attributeName";
		var attributeValue = true;

		var controlObject = session.createControlObject( "VoipModule", "0");

		assert.notEqual( controlObject, undefined);
		
		controlObject.addBoolAttribute( attributeName, attributeValue);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			runScript( '/mock/cppsubjectcallssender.js', [ "get", controlObject.name, attributeName], function( err, res){
				assert.equal( err, null);
			    assert.equal( strToBool( res), true);
		    	done();
			});
		});
	});

	it( 'should CPP send and JS receive Set Attribute', function( done){
		
		var attributeName = "attributeName";
		var attributeValue = false;
		
		var newAttributeValue = true;

		var controlObject = session.createControlObject( "VoipModule", "0");

		assert.notEqual( controlObject, undefined);
		
		controlObject.addBoolAttribute( attributeName, attributeValue);

		controlObject.init( function( err, res){
			if ( err != null) return done( err);

			runScript( '/mock/cppsubjectcallssender.js', [ "get", controlObject.name, attributeName], function( err, res){
				assert.equal( err, null);
			    assert.equal( strToBool( res), false);

				runScript( '/mock/cppsubjectcallssender.js', ["set", controlObject.name, attributeName, newAttributeValue], function( err, res){
					assert.equal( err, null);
					assert.equal( controlObject.getAttribute( attributeName), newAttributeValue);
			    	done();
				});
			});

		});
	});

    it( 'should CPP send and JS receive Notification', function( done){

        var controlObject = session.createControlObject( "VoipModule", "0");
        var remoteSubject = session.getRemoteSubject( controlObject);

        assert.notEqual( controlObject, null);
        assert.notEqual( remoteSubject, null);

        controlObject.init( function( err, res) {
            if ( err != null) return done( err);

            runScript( '/mock/cppsubjectcallssender.js', ["notify", controlObject.name], function( err, res){
                assert.equal( err, null);
            });

            var ControlSerialization = require( 'control_serialization_lib');
            var EventHelper = ControlSerialization.EventHelper;

            var events = []
            var event = EventHelper.createEvent( EventHelper.ANY_CONTROL_OBJECT, EventHelper.ANY_EVENT);

            events.push( event);

            setTimeout( function(){
                remoteSubject.subscribe( controlObject.name, events, function( err, subscribeResult, notification) {

                    if ( err != null) return done( err);

                    if( notification != null){
                        messageSerializer = new MessageSerializer();
                        var innerMessage = messageSerializer.parseFromBuffer( notification.message);

                        assert.notEqual( innerMessage.messageId, null);
                        assert.notEqual( innerMessage.call, null);
                        assert.notEqual( innerMessage.call.event, null);
                        assert.notEqual( innerMessage.call.event.sourceObject, null);
                        assert.notEqual( innerMessage.call.event.id, null);
                        assert.notEqual( innerMessage.call.event.data, null);

                        done();
                    };
                });
            }, 100);
        });
    });

    it( 'should CPP cache and JS get cached Attribute', function( done){

        var isResult = false;
        var scriptType = "TestScript";
        var scriptId = id.generate();

        var remoteScriptType = "Subject";
        var remoteScriptId = "0";

        var attributeName = "testCachedAttr";

        var controlObject = session.createControlObject( scriptType, scriptId);
        var remoteControlObject = session.createControlObject( remoteScriptType, remoteScriptId);

        assert.notEqual( controlObject, undefined);

        var remoteObject = session.getRemoteObject( remoteControlObject.name, controlObject);
        assert.notEqual( remoteObject, undefined);

        controlObject.init( function( err, res){
            if ( err != null) return done( err);
            controlObject.controlCacher.delCachedAttribute( remoteObject.name, attributeName, function(){

            });

            runScript( '/mock/cppsubjectcallsreceiver.js', ["isGet"], function( err, res){
                assert.equal( err, null);
                assert.equal( strToBool( res), true);
                if( isResult){
                    done();
                }
            });

            setTimeout( function(){
                remoteObject.getAttr( attributeName, function( err, res){
                    assert.equal( err, null);
                    assert.equal( res, "1");

                    remoteObject.getAttr( attributeName, function( err, res){
                        assert.equal( err, null);
                        assert.equal( res, "7");

                        isResult = true;
                    });
                });
            }, 400);
        });
    });

    it( 'should JS send presence hello and CPP receive', function( done){

        var scriptType = "TestScript";
        var scriptId = id.generate();

        var remoteScriptType = "Subject";
        var remoteScriptId = "0";

        var controlObject = session.createControlObject( scriptType, scriptId);
        var remoteControlObject = session.createControlObject( remoteScriptType, remoteScriptId);

        assert.notEqual( controlObject, undefined);

        var remoteObject = session.getRemoteObject( remoteControlObject.name, controlObject);
        assert.notEqual( remoteObject, undefined);

        runScript( '/mock/cppsubjectcallsreceiver.js', ["isHello"], function( err, res){
            assert.equal( err, null);
            assert.equal( strToBool( res), true);
            done();
        });

        controlObject.init( function( err, res){
            if ( err != null) return done( err);
            setTimeout( function(){

            }, 1000);
        });
    });

    it( 'should JS send presence bye and CPP receive', function( done){

        var scriptType = "TestScript";
        var scriptId = id.generate();

        var remoteScriptType = "Subject";
        var remoteScriptId = "0";

        var controlObject = session.createControlObject( scriptType, scriptId);
        var remoteControlObject = session.createControlObject( remoteScriptType, remoteScriptId);

        assert.notEqual( controlObject, undefined);

        var remoteObject = session.getRemoteObject( remoteControlObject.name, controlObject);
        assert.notEqual( remoteObject, undefined);

        runScript( '/mock/cppsubjectcallsreceiver.js', ["isBye"], function( err, res){
            assert.equal( err, null);
            assert.equal( strToBool( res), true);
            done();
        });

        controlObject.init( function( err, res){
            if ( err != null) return done( err);
            setTimeout( function(){
                controlObject.sendPresenceBye();
            }, 1200);
        });
    });
});

