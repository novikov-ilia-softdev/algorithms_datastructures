try{
	var controlMock = require( 'controlmock');
}
catch( e){
	process.stdout.write( "" + e);
	process.exit();
}

var subjectApp = exports = module.exports = {};
var subject = new controlMock.TestControlSubject();

subjectApp.run = function(){
	var funcName = null;

	process.on( 'message', function( message) {
	  funcName = message["function"];
	});

	subject.start();
	
	var funcType = process.argv[2];
	var scriptName= process.argv[3];
	var attributeName = process.argv[4];
	var attributeValue = process.argv[5];

	switch ( funcType) {
		case 'wait':
			setTimeout( function(){ console.log('waited:', scriptName);}, scriptName*1);
			break;
		case "notify":
			setTimeout(function(){
				subject.sendNotification( scriptName);
			}, 100);
			break;
		case "set":
			subject.setAttr( scriptName, attributeName, attributeValue);
			break;

		case "get":
		default:
			var result = subject.getAttr( scriptName, attributeName);
			process.stdout.write( result);
			break;
	}
	
	process.on( 'exit', function(){
		subject.stop();
	});
};

subjectApp.run();
