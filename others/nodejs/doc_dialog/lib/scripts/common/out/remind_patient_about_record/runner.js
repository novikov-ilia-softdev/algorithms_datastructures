var SCRIPT_ARGS_INDEX = 2;

var Script =  require('../inform_patient_new_record/script');

script = new Script( process.argv[ SCRIPT_ARGS_INDEX]);
script.scriptName = 'remind_patient_about_record';
script.run();