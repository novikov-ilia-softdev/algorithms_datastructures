var SCRIPT_ARGS_INDEX = 2;

var Script =  require('./script');

script = new Script( process.argv[ SCRIPT_ARGS_INDEX]);
script.run();