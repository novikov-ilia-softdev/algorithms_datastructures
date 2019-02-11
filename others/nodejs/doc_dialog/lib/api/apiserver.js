const http     = require('http');
const director = require('director');
const querystring  = require('querystring');

var Doctor = require( '../doctor/doctor');
var Record = require( '../doctor/record');
var RecordStatus = require( '../doctor/recordstatus');
var ScriptOption = require( '../scripts/scriptoption');
var ScriptNames = require( '../scripts/scriptnames');
var RouteList = require( './routelist');

module.exports = APIServer;

function APIServer ( module, settings)
{
  var self = this;
  self.module = module;

  var router = new director.http.Router();

  var informPatient = function ( doctor_phone_number, patient_phone_number, record_id, script_name, need_to_ask_cancel) {

    console.log( 'informPatient');
    console.log( arguments);
    console.log( this.req.body);

    var scenario = {
      scenario: this.req.body.scenario,
      scenario_path: this.req.body.scenario_path
    };

    var doctorPhoneNumberWithPlus = querystring.unescape( doctor_phone_number);
    var doctorPhoneNumberWithoutPlus = doctorPhoneNumberWithPlus.substring( 1);

    var doctor = null;
    try{
      doctor = new Doctor( this.req.body.doctor_id, this.req.body.doctor_name, this.req.body.doctor_description, doctorPhoneNumberWithoutPlus, this.req.body.doctor_contact_phone);
    }
    catch( ex)
    {
      this.res.writeHead(400);
      this.res.end();
      return;
    }

    var record = null;
    try{
      record = new Record( record_id, RecordStatus.approved.value, this.req.body.patient_id, this.req.body.doctor_id, this.req.body.appointment_start_time, this.req.body.timezone);
    }
    catch( ex)
    {
      console.log( ex);
      this.res.writeHead(400);
      this.res.end();
      return;
    }

    var behaviour_args = {};
    behaviour_args.need_to_ask_cancel = need_to_ask_cancel;
    behaviour_args.script_name = script_name;


    self.module.scriptLauncher.runInformPatientNewRecord( querystring.unescape( patient_phone_number), doctor, record, behaviour_args, module.scenarioManager.register(scenario));

    this.res.writeHead(200);
    this.res.end();
  }

  // curl -X POST  -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" -d "doctor_id=1&doctor_name=Сидоров Василий Петрович&doctor_description=Стоматологическая клиника здоровые зубы&doctor_contact_phone=1234&record_id=1&patient_id=2&appointment_start_time=1504261293&timezone=Europe/Moscow&scenario=bbbaaaddd-test15-test-test-bbbaaaddd&scenario_path=direct_api_call" http://localhost:8089/doctor/789/patient/456/records/123
  router.post ( RouteList.informNewRecord, function( doctor_phone_number, patient_phone_number, record_id){
    informPatient.bind( this, doctor_phone_number, patient_phone_number, record_id, ScriptNames.informNewRecord, ScriptOption.notAskCancelRecord)();
  });

  // curl -X POST  -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" -d "doctor_id=1&doctor_name=Сидоров Василий Петрович&doctor_description=Стоматологическая клиника здоровые зубы&doctor_contact_phone=1234&record_id=1&patient_id=2&appointment_start_time=1504261293&timezone=Europe/Moscow&scenario=bbbaaaddd-test15-test-test-bbbaaaddd&scenario_path=direct_api_call" http://localhost:8089/doctor/789/patient/456/remind_record/123
  router.post ( RouteList.remindRecord, function( doctor_phone_number, patient_phone_number, record_id){
    informPatient.bind( this, doctor_phone_number, patient_phone_number, record_id, ScriptNames.remindRecord, ScriptOption.notAskCancelRecord)();
  });

  // curl -X POST  -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" -d "doctor_id=1&doctor_name=Сидоров Василий Петрович&doctor_description=Стоматологическая клиника здоровые зубы&doctor_contact_phone=1234&record_id=1&patient_id=2&appointment_start_time=1504261293&timezone=Europe/Moscow&scenario=bbbaaaddd-test15-test-test-bbbaaaddd&scenario_path=direct_api_call" http://localhost:8089/doctor/789/patient/456/remind_record_with_cancel_ask/123
  router.post ( RouteList.remindRecordWithCancelAsk, function( doctor_phone_number, patient_phone_number, record_id){
    informPatient.bind( this, doctor_phone_number, patient_phone_number, record_id, ScriptNames.remindRecordWithCancelAsk, ScriptOption.askCancelRecord)();
  });

  self.run = function ( callback)
  {
    self.server = http.createServer(function (req, res) {
      req.chunks = [];
      req.on('data', function (chunk) {
        req.chunks.push(chunk.toString());
      });

      router.dispatch(req, res, function (err) {
        if (err) {
          res.writeHead(404);
          res.end();
        }
      });
    });
    self.server.listen(settings.port, callback);
  }

  self.stop = function(callback) {
    self.server.close(callback);
  }
}