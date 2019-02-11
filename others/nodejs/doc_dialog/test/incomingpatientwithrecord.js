var assert = require ('chai').assert;
const Script = require('../lib/scripts/common/incoming/patient_with_record/script')
var mocks = require('./utils/mocks');

describe('incoming call patient with record script', function() {
    it('cancel record', function (done) {
        var serviceManagerMock = mocks.getServiceManagerMock();
        var states = [];
        var expected_states = [
            'start',
            'play_greetings',
            'play_doctor_info',
            'play_record_date',
            'play_record_time',
            'ask_for_record_cancel',
            'yes',
            'record_cancelled',
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