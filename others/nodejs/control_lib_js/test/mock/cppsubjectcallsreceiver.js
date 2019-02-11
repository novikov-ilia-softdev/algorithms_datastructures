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

	process.on( 'exit', function(){
		subject.stop();
	});

	subject.start();
	
	var funcName = process.argv[2];
	
	setTimeout( function(){
		process.stdout.write( "" + subject[funcName]());
	}, 2000);
};

subjectApp.run();