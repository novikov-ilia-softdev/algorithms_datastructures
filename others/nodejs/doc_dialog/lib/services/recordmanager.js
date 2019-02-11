module.exports = RecordManager;

const querystring = require('querystring');

function RecordManager( httpWrapper, scenario, settings){
    var self = this;
    self.scenario = scenario;

    self.createRecord = function( doctorPhone, patientPhone, recordFile, callback){
        scenario = scenario || self.scenario;
        var request = {
            host: settings.core.host,
            port: settings.core.port,
            path: '/v1/records/bycall/' + doctorPhone + '/' + patientPhone,
            method: 'POST',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };

        var params = {
            'audio_message': recordFile
        };

        httpWrapper.send( request, params, null, callback);
    };

    self.cancelRecord = function( record, callback, scenario){
        self._updateRecordStatus (record.id, 'cancel',callback, scenario);
    };

    self._updateRecordStatus = function( recordId, status, callback, scenario){
        scenario = scenario || self.scenario;
        var request = {
            host: settings.core.host,
            port: settings.core.port,
            path: '/v1/records/'+recordId+'/'+status,
            method: 'PUT'
        };

        var params = {};
        if (scenario){
            params = scenario.addToServiceParams(params);
        }

        httpWrapper.send( request, params, null, callback);
    };
}
