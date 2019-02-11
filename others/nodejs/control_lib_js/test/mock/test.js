var channel = require( '../../index');
var MessageSerializer = require( '../../lib/serialization/messageserializer');

var session = channel.getSession();

session.start();
process.on( "exit", function(){
	session.stop();
});

var controlObject = session.createControlObject( "s", "1");
var remoteSubject = session.getRemoteSubject();

controlObject.init( function( err, res) {
	if ( err != null) return done( err);

	remoteSubject.subscribe( controlObject.name, function( err, subscribeResult, notification) {
		if ( err != null) return done( err);

		console.log( "sub");			
		if( subscribeResult != null && subscribeResult.result){
		}
		
		if( notification != null){
			messageSerializer = new MessageSerializer();
			var innerMessage = messageSerializer.parseFromBuffer( notification.message);

		};
		
	});
});
