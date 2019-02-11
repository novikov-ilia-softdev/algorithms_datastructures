module.exports = AdminService;

var crypto = require('crypto'),
    serviceManager = require('./servicemanager'),
    hash = crypto.createHash('md5');

function AdminService( httpWrapper, scenario, settings) {
    var self = this,
        queueService = serviceManager.getQueueService(scenario, settings),
        validationSessions = {};

    self.scenario = scenario;

    self.validate = function( user_id, phone_number, type, speech_file_path, speech_data){
        if(!validationSessions.hasOwnProperty(user_id)) {
            validationSessions[user_id] = hash.update(user_id + phone_number + Date.now()).digest('hex');
        }
        var request = {
            host: settings.admin.host,
            port: settings.admin.port,
            path: '/api/orders/validate',
            method: 'POST',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        }, params = {
            "user_id": user_id,
            "phone_number": phone_number,
            "type": type,
            "file_path": speech_file_path,
            "speech_data": JSON.stringify(speech_data),
            "session_id": validationSessions[user_id],
            "created_at": Math.floor(Date.now()/1000) // Date.now is in milliseconds, correct it according to Unix timestamp format
        };

        return new Promise( (resolve, reject) => {
            httpWrapper.send( request, params, null, (err, res) => {
                if(res && res.status == 200) {
                    queueService.init( (error) => {
                        if(!error) {
                            queueService.handle('voice_validation_response', phone_number, (data) => {
                                data = JSON.parse(data);
                                if(!data) {
                                    return reject('empty data');
                                }
                                resolve(data);
                            });
                        } else {
                            reject(error);
                        }
                    });
                } else {
                    reject( res ? res.errors : ( err ? err : 'no response'));
                }
            });
        });
    };
}