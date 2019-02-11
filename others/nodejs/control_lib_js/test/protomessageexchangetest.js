var assert = require( "assert");

var Message = require( 'control_serialization_lib').Message;
var MessageSerializer = require( 'control_serialization_lib').MessageSerializer;

var MessageExchanger =  require( '../lib/messageexchange/messageexchanger');

describe( 'Proto Message exchange',function(){
	var conf = {
		"transport": "local",
		"path": "/tmp/control_lib_js_test.sock"
	};

	var conf2 = {
		"transport": "local",
		"path": "/tmp/control_lib_js_test2.sock"
	};

    var messageExchanger = null;
    var messageExchanger2 = null;

    beforeEach( function(){
        messageExchanger = new MessageExchanger( conf);
        messageExchanger2 = new MessageExchanger( conf2);
    });

    afterEach( function(){
        messageExchanger.stop();
        messageExchanger2.stop();
    });
	
	it( 'should send and receive protobuf message',function( done){
		var messageSerializer = new MessageSerializer( __dirname + '/proto/testmessage.desc', 'message.TestMessage');
		
		var testMessage = {
			testUint32: 12834543,
			testString: "testString1",
			testObject: { testString: "testString2"}
		};

		var serializedMessage = messageSerializer.serializeFromObject( testMessage);
		
		var receive = function( err, res, rinfo){
			if ( err) return done( err);
			var resultMessage = messageSerializer.parseFromBuffer( res);
			assert.deepEqual( testMessage, resultMessage);
			done();
		};

        messageExchanger.receive( function( err, res){
			if ( err) return done( err);
            messageExchanger2.send( conf, serializedMessage, function( err, res){
				if ( err) return done( err);
			});
		}, receive);
	});

	it( 'should send and receive attribute protobuf message',function( done){
		var messageSerializer = new MessageSerializer();
	
		var testMessage = new Message( "sender");
		testMessage.createCall( "remote").createAttribute( "test", "scriptId", "attrName");
		
		var serializedMessage = messageSerializer.serializeFromObject( testMessage);
		
		var receive = function( err, res){
			if ( err) return done( err);
			var resultMessage = messageSerializer.parseFromBuffer( res);
			assert.deepEqual( testMessage, resultMessage);
			done();
		};

        messageExchanger.receive( function( err, res){
			if ( err) return done( err);
            messageExchanger2.send( conf, serializedMessage, function( err, res){
				if ( err) return done( err);
			});
		}, receive);
	});

	it( 'should send and receive notification subscribe result message',function( done){
		var messageSerializer = new MessageSerializer();
	
		var testMessage = new Message( "sender");
		testMessage.createResult( 1234).createNotificationSubscribeResult( true);
		
		var serializedMessage = messageSerializer.serializeFromObject( testMessage);
		
		var receive = function( err, res){
			if ( err) return done( err);
			var resultMessage = messageSerializer.parseFromBuffer( res);
			assert.deepEqual( testMessage, resultMessage);
			done();
		};

        messageExchanger.receive( function( err, res){
			if ( err) return done( err);
            messageExchanger2.send( conf, serializedMessage, function( err, res){
				if ( err) return done( err);
			});
		}, receive);
	});
});