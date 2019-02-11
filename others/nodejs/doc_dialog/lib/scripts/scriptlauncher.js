var util = require( 'util');
var EventEmitter = require( 'events').EventEmitter;
var child_process = require( 'child_process');
var phoneNumberHelper = require( './utils/phonenumberhelper');
var timeHelper = require( './utils/timehelper');
var DoctorSettings = require( '../settings/doctorsettings');

module.exports = ScriptLauncher;
util.inherits( ScriptLauncher, EventEmitter);

function ScriptLauncher( module){
    var self = this;
    var childProcesses = {};
    self.module = module;
    
    self._runScript = function  (scriptName, scriptArgs, id, scenario, doctorSettings)
    {
        scriptName = doctorSettings.scripts.basedir + scriptName;
        scriptArgs.scenario = scenario;

        var args = [];
        args.push( JSON.stringify( scriptArgs));

       var child = child_process.fork( scriptName, args);
       scenario.processStart (scriptName, args, child);
       childProcesses[ id] = { proc: child, scenario: scenario.getId()};
       child.on( 'message', function( message) {
            scenario.processMessage( child, message, null, "from child");
            self.emit( 'commandFromScript', message, id);
       });
       return child; //for tests;
    };

    self.runPatientWithoutRecord = function( srcPhoneNumber, doctor, id, scenario, doctorSettings){
        var scriptArgs = {};
        scriptArgs.srcPhoneNumber = srcPhoneNumber;
        scriptArgs.doctor = doctor;

        self._runScript( doctorSettings.scripts.patientWithoutRecord, scriptArgs, id, scenario, doctorSettings);
    };

    self.runPatientWithRecord = function( srcPhoneNumber, doctor, record, id, scenario, doctorSettings){
        var scriptArgs = {};
        scriptArgs.srcPhoneNumber = srcPhoneNumber;
        scriptArgs.doctor = doctor;
        scriptArgs.record = record;

        self._runScript( doctorSettings.scripts.patientWithRecord, scriptArgs, id, scenario, doctorSettings);
    };

    self.runInformPatientNewRecord = function ( patient_phone_number, doctor, record, behaviour_args, scenario)
    {
        var id = self.module.fsServer.registerClient( scenario.getId());

        var doctorSettings = DoctorSettings.getDefault();
        var scriptArgs = {};
        scriptArgs.patient_phone_number = patient_phone_number;
        scriptArgs.doctor = doctor;
        scriptArgs.record = record;
        scriptArgs.behaviour_args = behaviour_args;

        self._runScript( doctorSettings.scripts.informPatientNewRecordScript, scriptArgs, id, scenario, doctorSettings);
    };

    self.runRemindPatientAboutRecord = function ( patient_phone_number, doctor, record, scenario)
    {
        var id = self.module.fsServer.registerClient( scenario.getId());

        var doctorSettings = DoctorSettings.getDefault();
        var scriptArgs = {};
        scriptArgs.patient_phone_number = patient_phone_number;
        scriptArgs.doctor = doctor;
        scriptArgs.record = record;

        self._runScript( doctorSettings.scripts.remindPatientAboutRecordScript, scriptArgs, id, scenario, doctorSettings);
    };

    self.notifyScript = function( id, event, params){
        try{
            if( childProcesses[ id]){
                var child = childProcesses[ id].proc;
                var scenario =  self.module.scenarioManager.get(childProcesses[ id].scenario);
                scenario.processMessage( child, event, params, "to child");
                var message = params || {};
                message.event = event;
                child.send( message)
            }
        }
        catch( ex){

        }
    };
}