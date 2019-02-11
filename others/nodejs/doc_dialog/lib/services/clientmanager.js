module.exports = ClientManager;

const querystring  = require('querystring');
const EventEmitter = require( "events").EventEmitter;
const util         = require( "util");

var Doctor = require( '../doctor/doctor');
var Record = require( '../doctor/record');
var FreeRecord = require( '../doctor/freerecord');

util.inherits( ClientManager, EventEmitter);

function ClientManager( httpWrapper, scenario, settings){
    var self = this;
    self.scenario = scenario;

    self.getDoctor = function( phoneNumber, callback, scenario){
        scenario = scenario || self.scenario;

        var params = {};

        if (scenario){
            params = scenario.addToServiceParams(params);
        }

        var request = {
            host: settings.core.host,
            port: settings.core.port,
            path: '/v1/doctors/byworkphone/' + phoneNumber + ( params ? '?' + querystring.stringify(params) : ''),
            method: 'GET'
        };

        httpWrapper.send( request, null, null, function( err, object){
            if( err){
                callback( null);
                return;
            }

            var doctor = null;

            try{
                doctor = new Doctor( object.doctor.id, object.doctor.name, object.doctor.description, object.doctor.work_phone, object.doctor.contact_phone);
            }
            catch( ex)
            {
                doctor = null;
            }

            callback( doctor) ;
        });
    }

    self.isPatientHasRecord = function( patientPhoneNumber, doctorPhoneNumber, callback, scenario){
        scenario = scenario || self.scenario;

        var params = {};

        if (scenario){
            params = scenario.addToServiceParams(params);
        }

        var request = {
            host: settings.core.host,
            port: settings.core.port,
            path: '/v1/records/bycall/' + doctorPhoneNumber + '/' + patientPhoneNumber + ( params ? '?' + querystring.stringify(params) : ''),
            method: 'GET'
        };

        httpWrapper.send( request, null, null, function( err, object){
            if( err || !object.record){
                callback( null);
                return;
            }

            var record = null;

            try{
                record = new Record( object.record.id, object.record.status, object.record.patient_id, object.record.doctor_id, object.record.appointment_start_time, object.record.timezone);
            }
            catch( ex)
            {
                console.log( ex);
                record = null;
            }

            callback( record);
        });
    }

    self.getFreeRecord = function( doctorId, callback, scenario){
        scenario = scenario || self.scenario;

        var params = {};

        if (scenario){
            params = scenario.addToServiceParams(params);
        }

        var request = {
            host: settings.core.host,
            port: settings.core.port,
            path: '/v1/doctors/' + doctorId + '/free_room' + ( params ? '?' + querystring.stringify(params) : ''),
            method: 'GET'
        };

        httpWrapper.send( request, null, null, function( err, object){
            if( err || !object.nearest){
                callback( null);
                return;
            }

            var record = null;

            try{
                record = new FreeRecord( object.nearest.room.begin, object.nearest.room.end, object.nearest.midnight, object.nearest.timezone);
            }
            catch( ex)
            {
                console.log( ex);
                record = null;
            }

            callback( record);
        });
    }

    self.createPatient = function( phone_number, callback, scenario){
        scenario = scenario || self.scenario;
        var request = {
            host: settings.core.host,
            port: settings.core.port,
            path: '/v1/patients',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };

        var params = {
            phone_number: phone_number,
        };
        
         if (scenario){
            params = scenario.addToServiceParams(params);
        }

        httpWrapper.send( request, params, null, callback);
    }

    self.notifyAboutCallResult = function( name, record_id, call_result, callback, scenario){
        scenario = scenario || self.scenario;
        var request = {
            host: settings.core.host,
            port: settings.core.port,
            path: '/v1/records/' + record_id + '/backcall/' + name + '/' + call_result,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };

        var params = {};

        if (name && name!=""){
            params.name = name;
        }

        if (scenario){
            params = scenario.addToServiceParams(params);
        }

        httpWrapper.send( request, params, null, callback);
    }
}
