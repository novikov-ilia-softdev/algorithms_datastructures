module.exports = Script;

var machina = require('machina');
var ceHelper = require('../../..//utils/connectioneventhelper');
var path = require('path');

function Script( argsString){
    var self = this;

    self.argsObj = JSON.parse( argsString);
    self.serviceManager = require('../../../../services/servicemanager');

    self.run = function(){
        self.scenario = require('../../../../scenario/scenariomanager').parse( JSON.stringify( self.argsObj.scenario));
        self.scenario.setPathSuffix( 'patient_without_record');
        self.audioProvider = self.serviceManager.getAudioProvider( self.scenario);
        self.callConnection = self.serviceManager.getCallConnection( self.scenario);
        self.listeners = ceHelper.activate( self.callConnection, self.fsm);
        self.recordManager = self.serviceManager.getRecordManager( self.scenario);
        self.clientManager = self.serviceManager.getClientManager( self.scenario);
        require('../../../utils/commonmixins').extend( self);
        var settings = require('../../../../settings/settings');
        require('../../../utils/commonmixins').extend( self, { maxRepeats : settings.maxRepeatsNumber});

        self.audioProvider.init( function( error) {
            error ? self.fsm.transition( 'hangup') : self.fsm.transition( 'start');
        });
    };

    self.fsm = new machina.Fsm({
        initialize: function( options ) {
        },

        namespace: 'patientWithoutRecord',
        initialState: 'ready',

        states: {
            ready : { '*': function() { self.fsm.deferUntilTransition(); }},//ready
            start : {
                _onEnter : function() { self.fsm.transition( 'get_free_record'); },
                '*': function() { self.fsm.deferUntilTransition(); }
            },//start

            get_free_record : {
                _onEnter: function () {
                    self.clientManager.getFreeRecord( self.argsObj.doctor.id, function( freeRecord){
                        self.freeRecord = freeRecord;
                        self.freeRecordFiles = [];
                        self.freeRecord ? self.fsm.transition( 'get_free_record_relative_time') : self.fsm.transition( 'get_no_free_record');
                    }, self.scenario);
                },
                'CallEnded': 'exit',
            },

            get_free_record_relative_time : {
                _onEnter: function() { self.getFile( self.audioProvider.getFreeRecordRelativeTimeFileId(), {name: self.freeRecord.humanReadableRelativeTime}); },
                'GotFileName': function( filePath) {
                    self.freeRecordRelativeTimeFilePath = filePath;
                    self.freeRecordFiles.push( self.freeRecordRelativeTimeFilePath);
                    self.fsm.transition( 'get_free_record_date');
                },
                'ErrFileName': 'play_greetings',
                'CallEnded': 'exit'
            },

            get_free_record_date : {
                _onEnter: function() { self.getFile( self.audioProvider.getFreeRecordDateFileId(), {date: self.freeRecord.humanReadableDate}); },
                'GotFileName': function( filePath) {
                    self.freeRecordDateFilePath = filePath;
                    self.freeRecordFiles.push( self.freeRecordDateFilePath);
                    self.fsm.transition( 'get_free_record_time');
                },
                'ErrFileName': 'play_greetings',
                'CallEnded': 'exit'
            },

            get_free_record_time : {
                _onEnter: function() { self.getFile( self.audioProvider.getFreeRecordTimeFileId(), {time: self.freeRecord.minutes}); },
                'GotFileName': function( filePath) {
                    self.freeRecordTimeFilePath = filePath;
                    self.freeRecordFiles.push( self.freeRecordTimeFilePath);
                    self.fsm.transition( 'play_greetings');
                },
                'ErrFileName': 'play_greetings',
                'CallEnded': 'exit'
            },

            get_no_free_record : {
                _onEnter: function() { self.getFile( self.audioProvider.getNoFreeRecordFileId()); },
                'GotFileName': function( filePath) {
                    self.noFreeRecordFilePath = filePath;
                    self.freeRecordFiles.push( self.noFreeRecordFilePath);
                    self.fsm.transition( 'play_greetings');
                },
                'ErrFileName': 'play_greetings',
                'CallEnded': 'exit'
            },

            play_greetings:{
                _onEnter: function() { self.answer();},
                'GotAnswerCall' : function() { self.getAndPlayPhrase( self.audioProvider.getHelloPatientFileId(), {name: self.argsObj.doctor.description});
                },
                'PlayingFileEnd': 'play_doctor_info',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },//play_greetings

            play_doctor_info : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getDoctorInfoFileId(), {name: self.argsObj.doctor.name}); },
                'PlayingFileEnd': 'ivr_menu',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //play_doctor_info

            ivr_menu:{
                _onEnter: function() { self.getAndPlayDTMFQuery( self.audioProvider.getIVRMenuFileId()); },
                'AskAgain': function () { self.askDTMFAgain ( 'repeatsIVRDTMFNumber', null, self.audioProvider.getIVRMenuFileId()); },
                'dtmf': function (dtmf){
                    if( dtmf.err){ this.handle('AskAgain'); }
                    else{
                        switch( dtmf.digit){
                            case '1': self.fsm.transition('connect_patient_and_doctor'); break;
                            case '2': self.fsm.transition('play_free_record_info'); break;

                            default : this.handle('AskAgain');
                        }
                    }
                },
                'ErrFileName': 'report_error',
                'PlayingFileEnd': 'report_error',
                'ErrPlayingFile': 'report_error',
                'UnknownError' : 'report_error',
                'MaxRepeats' : 'report_error',
                'CallEnded': 'exit'
            }, //ivr_menu

            play_free_record_info : {
                _onEnter: function() {
                    self.playFiles()( self.freeRecordFiles);
                },
                'PlayingFileEnd': 'ask_for_record',
                'ErrPlayingFile': 'report_error',
                'CallEnded': 'exit'
            },

            connect_patient_and_doctor : {
                _onEnter: function () {self.getAndPlayPhrase( self.audioProvider.getConnectingPatientAndDoctorFileId());},
                'PlayingFileEnd': function(){ self.callConnection.bridgeCall( self.argsObj.doctor.phone_number_comm); },
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'BridgeAnswered': function(){ self.doctorAnswered = true; },
                'BridgeEnded': function(){ self.doctorAnswered ?  self.fsm.transition( 'doctor_answered') : self.fsm.transition( 'doctor_not_answered');},
                'CallEnded': 'exit',
            }, //connect_patient_and_doctor

            doctor_answered : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getDoctorAnsweredFileId()); },
                'PlayingFileEnd': 'goodbye',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //doctor_answered

            doctor_not_answered : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getDoctorNotAnsweredFileId()); },
                'PlayingFileEnd': 'play_free_record_info',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //doctor_not_answered

            ask_for_record : {
                _onEnter: function() { self.getAndPlayQuery( self.audioProvider.getRecordQueryFileId(), null, null, self.userSayTimeoutMs, false); },
                'AskAgain': function () { self.askAgain( 'repeatsAskForRecordNumber', 'askForRecordFilePath', self.audioProvider.getRecordQueryFileId())},
                'ReceiveFile': function (event){
                    //self.recordFilename = path.basename(event.amrFilePath);
                    self.recordFilename = path.basename(event.rate16000FilePath);
                    self.getAndPlayPhraseWhateverResult( self.audioProvider.getThanksPhraseFileId(),null ,'ThanksPlayed');
                },
                'ThanksPlayed': 'create_record',
                'ErrReceiveFile': function (err) { this.handle('AskAgain'); },
                'MaxRepeats' : 'report_error',
                'ErrFileName': 'report_error',
                'ErrPlayingFile': 'report_error',
                'UnknownError' : 'report_error',
                'CallEnded': 'exit'

            }, //ask_for_record

            create_record : {
                _onEnter: function() {
                    self.recordManager.createRecord( self.argsObj.doctor.phone_number_work, self.argsObj.srcPhoneNumber, self.recordFilename, function( err, record){});
                    self.fsm.transition( 'recall');
                }

            }, //create_record

            recall : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getRecallFileId()); },
                'PlayingFileEnd': 'goodbye',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //recall

            goodbye : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getGoogbyeFileId()); },
                'PlayingFileEnd': 'hangup',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //goodbye

            hangup : {
                _onEnter: function(){ self.callConnection.finishCall(); },
                'CallEnded' : 'exit'
            }, //hangup

            report_error : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getTalkErrorPhraseFileId()); },
                'ErrFileName': 'hangup',
                'PlayingFileEnd': 'hangup',
                'CallEnded': 'exit'
            }, //report_error

            exit : {
                _onEnter: function() { ceHelper.deactivate( self.callConnection, self.listeners); if ( self.scenario) self.scenario.end();
                }
            } //exit

        }//states
    });//fsm

} //Script
