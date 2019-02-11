var assert = require ('chai').assert;
const Script = require('../lib/scripts/common/out/inform_patient_new_record/script')
var mocks = require('./utils/mocks');

describe('inform patient new record script', function() {
    it('new record', function (done) {
        var serviceManagerMock = mocks.getServiceManagerMock();
        var states = [];
        var expected_states = [
            'start',
            'get_greetings',
            'get_doctor_info',
            'get_record_date',
            'get_record_time',
            'get_happy_to_help',
            'get_goodbye',
            'get_report_error',
            'calling',
            'waiting',
            'play_greetings',
            'play_doctor_info',
            'play_record_date',
            'play_record_time',
            'happy_to_help',
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
        script.waitTimeoutMs = 1;

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

        var record = {
            id: 56789,
            patientId: 12,
            doctorId: 34,
            humanReadableDate: '124412',
            minutes: 650
        };

        var scenario =  require( '../lib/scenario/scenariomanager').get( 'testScenarioId');

        scriptArgs.doctor = doctor;
        scriptArgs.scenario = scenario;
        scriptArgs.record = record;

        return JSON.stringify( scriptArgs);
    }
})