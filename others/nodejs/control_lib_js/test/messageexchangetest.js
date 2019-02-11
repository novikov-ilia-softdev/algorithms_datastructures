var assert = require( "assert");
var MessageExchanger =  require( '../lib/messageexchange/messageexchanger');

describe( 'Simple Message exchange',function(){
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
	
	it( 'should send text msg',function( done){
		var message = "testString";

        messageExchanger.receive( function( err, res){
			if ( err != null) return done( err);
            messageExchanger.send( conf, message, done);
		});
	});
	
	it( 'should receive text msg',function( done){
		var message = "testString";

        var receive = function( err, res){
			if ( err) return done( err);
			assert.equal( res, message);
			done();
		};

        messageExchanger.receive( function( err, res){
			if ( err) return done( err);
            messageExchanger.send( conf, message);
		}, receive);
	});


	it( 'should receive from different receivers',function( done){
		var receivedMessagesCount = 0;

		var message1 = "testString1";
		var message2 = "testString2";

		var receive1 = function( err, res){
			if ( err) return done( err);
			assert.equal( res, message1);

			if( receivedMessagesCount < 2)
				receivedMessagesCount++;
			if( receivedMessagesCount == 2)
				done();
		};

		var receive2 = function( err, res){
			if ( err) return done( err);
			assert.equal( res, message2);

			if( receivedMessagesCount < 2)
				receivedMessagesCount++;
			if( receivedMessagesCount == 2)
				done();
		};

        messageExchanger.receive( function( err, res) {
			if ( err) return done( err);
            messageExchanger2.send( conf, message1);
		}, receive1);
        messageExchanger2.receive( function( err, res) {
			if ( err) return done( err);
            messageExchanger.send( conf2, message2);
		}, receive2);
	});

	it( 'should receive messages with bifferent byte sizes',function( done){
		var message = "";
		var messages = [];
		var sendMessagesCount = 10;
		var receivedMessagesCount = 0;

		var receive = function( err, res){
			if ( err) return done( err);
			receivedMessagesCount++;

			assert.equal( res.toString(), messages[ receivedMessagesCount], 'Dont work send for ' + res.length + ' bytes');
			if( receivedMessagesCount == sendMessagesCount)
				done();
		};

        messageExchanger.receive( function( err, res){
			if ( err) return done( err);

			for( var i = 1; i <= sendMessagesCount ; i++){
				message += "0123456789";
				messages[i] = message;
				var buffer = new Buffer( message);
                messageExchanger2.send( conf, buffer);
			}
		}, receive);
	});
});