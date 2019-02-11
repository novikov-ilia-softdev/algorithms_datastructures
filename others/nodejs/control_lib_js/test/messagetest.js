var assert = require( "assert");

var Message = require( 'control_serialization_lib').Message;
var MessageSerializer = require( 'control_serialization_lib').MessageSerializer;
var MessageId = require( 'control_serialization_lib').MessageId;

describe( 'Message Test', function(){
	var messageSerializer = new MessageSerializer();

	it( 'should serialize and parse Call Access', function(){
		
		var testMessage = new Message( "sender");
		testMessage.createCall( "remote").createAccess( "name", "scriptId", "lock");

		var serializedMessage = messageSerializer.serializeFromObject( testMessage);
		var resultMessage = messageSerializer.parseFromBuffer( Buffer( serializedMessage));
		
		assert.deepEqual( testMessage, resultMessage);
	});
	
	it( 'should serialize and parse Call Access Result', function(){
		
		var testMessage = new Message( "sender");
		testMessage.createResult( 12134123).createAccessResult( "name", "scriptId", true);

		var serializedMessage = messageSerializer.serializeFromObject( testMessage);
		var resultMessage = messageSerializer.parseFromBuffer( Buffer( serializedMessage));
		
		assert.deepEqual( testMessage, resultMessage);
	});

	it( 'should create Result with correct correlationId', function(){
		var testMessageId = MessageId.generate();
		var message = new Message( "sender");
		message.createResult( testMessageId);

		assert.equal( message.result.correlationId, testMessageId);
	});
});