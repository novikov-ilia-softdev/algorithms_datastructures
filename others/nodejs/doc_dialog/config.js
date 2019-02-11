var settings = module.exports = {};
//TODO: разбить настройки по группам чтобы было понятно кто их использует
//TODO: переписать в другом стиле

settings.userSaidDirectory = '/tmp/dialog/userSaid/';
settings.userSayTimeoutMs = 7000;
settings.userStartSpeechTimeoutMs = 10000;
settings.userStopSpeechTimeoutMs = 30000;
settings.DTMFTimeoutMs = 10000;

//api
settings.api = {};
settings.api.port = 8089;

//common
settings.common = {};
settings.common.log_dir = '/tmp/dialog';

//logger
settings.logger = {};
settings.logger.enable = true;
settings.logger.tag  = "voxi.voice_dialog.message";
settings.logger.connection = {};
settings.logger.connection.host = "fluentd";
settings.logger.connection.port = 24224;
settings.logger.connection.timeout = 3.0;
settings.logger.connection.reconnectInterval = 600000; // 10 minutes

//httpWrapper
settings.httpWrapper = {}
settings.httpWrapper.dir = settings.common.log_dir;
settings.httpWrapper.file = 'http_wrapper.log';

//services
settings.services = {}
settings.services.speech = { host: 'speech_speech_1', port: 8083 };
settings.services.geo    = { host: 'geo_geo_1', port: 8084 };
settings.services.core   = { host: 'core_nginx_1', port: 80 };
settings.services.admin = { host: 'voxi_admin', port: 8080 };
settings.services.queue = { host: 'queue', port: 5672, login: 'guest', password: 'guest', vhost: '/'};

//script settings
settings.maxRepeatsNumber = 2;

//freeswitch
settings.freeswitch = {};
settings.freeswitch.eslHost = 'fs';
settings.freeswitch.eslPort = '8021';
settings.freeswitch.eslUser = 'ClueCon';

//tts
settings.tts = {};
settings.tts.engine = 'crt';// crt/nuance/plain
settings.tts.engine_config = {
    apikey: "6b7bee53-d280-44ec-bc1f-5c557548983a",
    ttsVoice: "Юлия",
    textFormat: "text/plain",
    hostname: "voicefabric.ru",
    url: "/WSServer/ws/tts"
};

settings.tts.path = "/tmp/dialog/crt/";
settings.tts.extension = '.wav'
settings.tts.db = {};
settings.tts.db.path = __dirname + '/db/';
settings.tts.db.name = 'audiofilesmap.loki';
settings.tts.phraseListFile = settings.tts.db.path+'phraselist.json';
settings.tts.cache = {};
settings.tts.cache.enabled = true;
settings.tts.cache.file = settings.tts.db.path+'ttscache.json';
settings.tts.files = {};
settings.tts.files.dir = '/tmp/voice_dialog/audio';
settings.tts.composer = {};
settings.tts.composer.path = "/tmp/voice_dialog/audioprovider/";
settings.tts.composer.format = "wav";
settings.tts.composer.extension = '.' + settings.tts.composer.format;

settings.time ={};
settings.time.startSleepHour = 21;
settings.time.stopSleepHour = 6;
settings.time.defaultTimezone = 'Europe/Moscow';

settings.doctor_settings = {};
settings.doctor_settings.default = {};
settings.doctor_settings.default.scripts = {};
settings.doctor_settings.default.scripts.basedir = __dirname + '/lib/scripts/common/';
settings.doctor_settings.default.scripts.patientWithoutRecord = 'incoming/patient_without_record/runner.js';
settings.doctor_settings.default.scripts.patientWithRecord  = 'incoming/patient_with_record/runner.js';
settings.doctor_settings.default.scripts.informPatientNewRecordScript  = 'out/inform_patient_new_record/runner.js';
settings.doctor_settings.default.scripts.remindPatientAboutRecordScript  = 'out/remind_patient_about_record/runner.js';

settings.outgoingCall = {};
settings.outgoingCall.goip = {};
settings.outgoingCall.goip.callQueueMaxLength = 10;
settings.outgoingCall.goip.gateways = []
settings.outgoingCall.goip.gateways.push( {'operator': 'Beeline', 'callEndpoint': 'goip', 'prefix': '1_'});
settings.outgoingCall.goip.gateways.push( {'operator': 'Beeline', 'callEndpoint': 'goip', 'prefix': '2_'});
settings.outgoingCall.goip.gateways.push( {'operator': 'Megafon', 'callEndpoint': 'goip', 'prefix': '3_'});
settings.outgoingCall.goip.gateways.push( {'operator': 'MTS', 'callEndpoint': 'goip', 'prefix': '4_'});
settings.outgoingCall.operators = [];

// multifon endpoint = megafon_doctor_ + doctor_phone_number

// http://8sot.su/ru/regions/penza
settings.outgoingCall.operators.push( { 'name': 'Beeline', 'prefixes': [ '903', '905', '906', '909', '960', '961', '962', '963', '964', '965', '966', '967', '969'] });
settings.outgoingCall.operators.push( { 'name': 'Megafon', 'prefixes': [ '927', '929','937'] });
settings.outgoingCall.operators.push( { 'name': 'MTS', 'prefixes': [ '986', '987', '902', '908', '950'] });
settings.outgoingCall.operators.push( { 'name': 'Tele2', 'prefixes': [ '900', '904', '951', '952', '953', '996'] });
//settings.outgoingCall.operators.push( { 'name': 'Smarts', 'prefixes': [ '902', '908', '950' ] }); // -> MTS
settings.outgoingCall.operators.push( { 'name': 'Yota', 'prefixes': [ '958', '999'] });
