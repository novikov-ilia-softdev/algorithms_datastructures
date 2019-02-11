var assert = require ('chai').assert;
const Script = require('../lib/scripts/common/incoming/patient_without_record/script')
var mocks = require('./utils/mocks');

describe('incoming call patient without record script', function() {
    it('ok bridge to doctor', function (done) {
        var serviceManagerMock = mocks.getServiceManagerMock();
        var states = [];
        var expected_states = [
            'start',
            'play_greetings',
            'play_doctor_info',
            'ivr_menu',
            'connect_patient_and_doctor',
            'doctor_answered',
            'goodbye',
            'hangup',
            'exit'
        ];

        var script = new Script( createScriptArgs());
        script.fsm.on('transition', function (data){
            states.push( data.toState);
            if( data.toState == 'exit'){
                assert.deepEqual(expected_states, states);
                done();
            }
        });

        script.serviceManager = serviceManagerMock;
        script.serviceManager.CallConnection.dtmf = '1';
        script.serviceManager.CallConnection.shouldDoctorAnswer = true;

        script.run();
    })

    it('error bridge to doctor', function (done) {
        var serviceManagerMock = mocks.getServiceManagerMock();
        var states = [];
        var expected_states = [
            'start',
            'play_greetings',
            'play_doctor_info',
            'ivr_menu',
            'connect_patient_and_doctor',
            'doctor_not_answered',
            'goodbye',
            'hangup',
            'exit'
        ];

        var script = new Script( createScriptArgs());
        script.fsm.on('transition', function (data){
            states.push( data.toState);
            if( data.toState == 'exit'){
                assert.deepEqual(expected_states, states);
                done();
            }
        });

        script.serviceManager = serviceManagerMock;
        script.serviceManager.CallConnection.dtmf = '1';
        script.serviceManager.CallConnection.shouldDoctorAnswer = false;

        script.run();
    })

    it('create record in auto mode', function (done) {
        var serviceManagerMock = mocks.getServiceManagerMock();
        var states = [];
        var expected_states = [
            'start',
            'play_greetings',
            'play_doctor_info',
            'ivr_menu',
            'ask_for_record',
            'create_record',
            'recall',
            'goodbye',
            'hangup',
            'exit'
        ];

        var script = new Script( createScriptArgs());
        script.fsm.on('transition', function (data){
            states.push( data.toState);
            if( data.toState == 'exit'){
                assert.deepEqual(expected_states, states);
                done();
            }
        });

        script.serviceManager = serviceManagerMock;
        script.serviceManager.CallConnection.dtmf = '2'

        script.run();
    })

    var createScriptArgs = function(){
        var scriptArgs = {};
        scriptArgs.srcPhoneNumber = '89631094567';

        var doctor = {
            id: 1,
            name: 'testDoctorName',
            description: 'testDescription',
            phone_number_comm: 'testPhoneComm',
            phone_number_work: 'testPhoneWork'
        };

        var scenario =  require( '../lib/scenario/scenariomanager').get( 'testScenarioId');

        scriptArgs.doctor = doctor;
        scriptArgs.scenario = scenario;

        return JSON.stringify( scriptArgs);
    }
})