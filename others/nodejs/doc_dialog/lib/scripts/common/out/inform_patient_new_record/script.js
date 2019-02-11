module.exports = Script;

var machina = require('machina');
var ceHelper = require('../../../utils/connectioneventhelper');
var path = require('path');

function Script( argsString){
    var self = this;

    self.argsObj = JSON.parse( argsString);
    self.serviceManager = require('../../../../services/servicemanager');
    self.waitTimeoutMs = 2500;
    self.scriptName = self.argsObj.behaviour_args.script_name;

    self.run = function(){
      self.scenario = require('../../../../scenario/scenariomanager').parse( JSON.stringify( self.argsObj.scenario));
      self.scenario.setPathSuffix( self.scriptName);
      self.audioProvider = self.serviceManager.getAudioProvider( self.scenario);
      self.callConnection = self.serviceManager.getCallConnection( self.scenario);
      self.clientManager  = self.serviceManager.getClientManager( self.scenario);
      self.listeners = ceHelper.activate( self.callConnection, self.fsm);
      self.speechRecognitionService = self.serviceManager.getSpeechRecognitionService( self.scenario);
      self.recordManager = self.serviceManager.getRecordManager( self.scenario);
      require('../../../utils/commonmixins').extend( self);
      var settings = require('../../../../settings/settings');
      require('../../../utils/commonmixins').extend( self, { maxRepeats : settings.maxRepeatsNumber});
      require('../../../utils/multiplyhandlermixins').extend( self);
      require('../../../utils/speechmixins').extend( self);

      self.audioProvider.init( function( error) {
        error ? self.fsm.transition( 'hangup') : self.fsm.transition( 'start');
      });
    };

    self.fsm = new machina.Fsm({
        initialize: function( options ) {
        },

        namespace: self.scriptName,
        initialState: 'ready',

        states: {
            ready : { '*': function() { this.deferUntilTransition(); }},//ready
            start : {
              _onEnter : function() { this.transition('get_greetings'); },
              '*': function() { this.deferUntilTransition(); }
            },//start

            get_greetings: {
                _onEnter: function(){ self.getFile( self.audioProvider.getOutCallHelloPatientFileId(), {name: self.argsObj.doctor.description}); },
                'GotFileName': function( filePath) {
                    self.greetingsFilePath = filePath;
                    self.fsm.transition( 'get_doctor_info');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            get_doctor_info: {
                _onEnter: function(){ self.getFile( self.audioProvider.getDoctorInfoFileId(), {name: self.argsObj.doctor.name}); },
                'GotFileName': function( filePath) {
                    self.doctorInfoFilePath = filePath;
                    self.fsm.transition( 'get_record_date');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            get_record_date: {
                _onEnter: function(){ self.getFile( self.audioProvider.getRecordDateFileId(), {date: self.argsObj.record.humanReadableDate}); },
                'GotFileName': function( filePath) {
                    self.recordDateFilePath = filePath;
                    self.fsm.transition( 'get_record_time');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            get_record_time: {
                _onEnter: function(){ self.getFile( self.audioProvider.getRecordTimeFileId(), {time: self.argsObj.record.minutes}); },
                'GotFileName': function( filePath) {
                    self.recordTimeFilePath = filePath;
                    self.fsm.transition( 'get_happy_to_help');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            get_happy_to_help: {
                _onEnter: function(){ self.getFile( self.audioProvider.getHappyToHelpFileId()); },
                'GotFileName': function( filePath) {
                    self.happyToHelpFilePath = filePath;
                    self.fsm.transition( 'get_goodbye');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            get_goodbye: {
                _onEnter: function(){ self.getFile( self.audioProvider.getGoogbyeFileId()); },
                'GotFileName': function( filePath) {
                    self.goodbyeFilePath = filePath;
                    self.fsm.transition( 'get_report_error');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            get_report_error: {
                _onEnter: function(){ self.getFile( self.audioProvider.getTalkErrorPhraseFileId()); },
                'GotFileName': function( filePath) {
                    self.reportErrorFilePath = filePath;
                    self.fsm.transition( 'get_will_you_come');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            get_will_you_come: {
                _onEnter: function(){ self.getFile( self.audioProvider.getWillYouComeFileId()); },
                'GotFileName': function( filePath) {
                    self.willYouComeFilePath = filePath;
                    self.fsm.transition( 'get_repeat_will_you_come');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            get_repeat_will_you_come: {
                _onEnter: function(){ self.getFile( self.audioProvider.getRepeatWillYouComeFileId()); },
                'GotFileName': function( filePath) {
                    self.repeatWillYouComeFilePath = filePath;
                    self.fsm.transition( 'get_record_canceled');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            get_record_canceled: {
                _onEnter: function(){ self.getFile( self.audioProvider.getRecordCancelledPhraseId()); },
                'GotFileName': function( filePath) {
                    self.recordCanceledFilePath = filePath;
                    self.fsm.transition( 'calling');
                },
                'ErrFileName': 'handle_get_file_error'
            },

            calling: {
              _onEnter: function(){ self.callConnection.makeCall( self.argsObj.patient_phone_number, null, self.argsObj.doctor.phone_number_work); },
              'CallEnded' : function(){
                  self.clientManager.notifyAboutCallResult( self.scriptName, self.argsObj.record.id, 'no_answer', function(){
                      self.fsm.transition( 'exit');
                  }, self.scenario);
              },
              'PickedUp' : 'waiting'
            },

            waiting: {
                _onEnter: function () {
                    setTimeout(function () {
                        self.fsm.transition('play_info');
                    }, self.waitTimeoutMs);
                },

                'CallEnded': 'exit'
            },

            play_info:{
                _onEnter: function() {
                    var files = [];
                    files.push( self.greetingsFilePath);
                    files.push( self.doctorInfoFilePath);
                    files.push( self.recordDateFilePath);
                    files.push( self.recordTimeFilePath);
                    self.playFiles()( files);
                },
                'PlayingFileEnd': function(){
                    self.clientManager.notifyAboutCallResult( self.scriptName, self.argsObj.record.id, 'success', null, self.scenario);
                    self.argsObj.behaviour_args.need_to_ask_cancel ? self.fsm.transition('will_you_come') : self.fsm.transition('yes');
                },
                'ErrPlayingFile': 'report_error',
                'CallEnded': 'exit'
            },

            will_you_come: {
                _onEnter: function() { self.getAndPlayQuery( self.audioProvider.getWillYouComeFileId());},
                'AskAgain': function (){ self.multiplyHandler.add('AskAgain');},
                'ReceiveFile': function (event){
                    self.multiplyHandler.reset();
                    self.getAndPlayPhraseWhateverResult( self.audioProvider.getThanksPhraseFileId(), null ,'ThanksPlayed');
                    self.detectAgreement( event.originalFilePath);
                },
                'Detected': function (agree){
                    if ( agree) {
                        self.multiplyHandler.add('YesDetected');
                    } else {
                        self.multiplyHandler.add('NoDetected');
                    }
                },
                'AskAgain..ThanksPlayed': function (){ self.askAgain ( 'repeatsRecordCancelNumber', 'recordAgreementQueryFilePath', self.audioProvider.getRepeatWillYouComeFileId());},
                'ThanksPlayed..YesDetected': 'yes',
                'NoDetected..ThanksPlayed': 'no',
                'ThanksPlayed':function (){ self.multiplyHandler.add('ThanksPlayed'); },
                'CallEnded': 'exit',
                'MaxRepeats':  'report_error',
                'ErrReceiveFile': function (err) {
                    self.multiplyHandler.reset();
                    self.multiplyHandler.add('ThanksPlayed');
                    this.handle('AskAgain');
                },
                'ErrFileName': 'report_error',
                'ErrPlayingFile': 'report_error',
                'UnknownError' : 'report_error'
            },

            yes : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getHappyToHelpFileId()); },
                'PlayingFileEnd': 'goodbye',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },

            no : {
                _onEnter: function() {
                    self.recordManager.cancelRecord( self.argsObj.record, function( err){});
                    self.getAndPlayPhrase( self.audioProvider.getRecordCancelledPhraseId()); },
                'PlayingFileEnd': 'goodbye',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },

            goodbye : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getGoogbyeFileId()); },
                'PlayingFileEnd': 'hangup',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },

            hangup : {
                _onEnter: function(){
                    self.callConnection.finishCall(); },
                'CallEnded' : 'exit'
            },

            report_error : {
                _onEnter: function() { self.playPhrase()( self.reportErrorFilePath); },
                'ErrFileName': 'hangup',
                'PlayingFileEnd': 'hangup',
                'CallEnded': 'exit'
            },

            handle_get_file_error : {
                _onEnter: function() { self.clientManager.notifyAboutCallResult( self.scriptName, self.argsObj.record.id, 'no_answer', function(){
                    self.fsm.transition( 'exit');
                }, self.scenario); }
            },

            exit : {
                _onEnter: function() { ceHelper.deactivate( self.callConnection, self.listeners); if ( self.scenario) self.scenario.end();
                }
            }
        }
    });//fsm

} //Script
