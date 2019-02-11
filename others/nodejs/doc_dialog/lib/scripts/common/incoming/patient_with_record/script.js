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
        self.speechRecognitionService = self.serviceManager.getSpeechRecognitionService( self.scenario);
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

        namespace: 'patientWithRecord',
        initialState: 'ready',

        states: {
            ready : { '*': function() { self.fsm.deferUntilTransition(); }},//ready
            start : {
                _onEnter : function() { self.fsm.transition( 'play_greetings'); },
                '*': function() { self.fsm.deferUntilTransition(); }
            },//start

            play_greetings:{
                _onEnter: function() { self.answer();},
                'GotAnswerCall' : function() { self.getAndPlayPhrase( self.audioProvider.getHelloPatientFileId(), {name: self.argsObj.doctor.description}); },
                'PlayingFileEnd': 'play_doctor_info',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },//play_greetings

            play_doctor_info : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getDoctorInfoFileId(), {name: self.argsObj.doctor.name}); },
                'PlayingFileEnd': 'check_record_status',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //play_doctor_info

            check_record_status:{
                _onEnter: function() {
                    if( self.argsObj.record.isDraft){
                        self.fsm.transition( 'play_record_draft');
                        return;
                    }

                    if( self.argsObj.record.isApproved){
                        self.fsm.transition( 'play_record_date');
                        return;
                    }
                },
            },

            play_record_draft : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getRecordDraftFileId())},
                'PlayingFileEnd': 'recall',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },

            recall : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getRecallFileId()); },
                'PlayingFileEnd': 'goodbye',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //recall

            play_record_date : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getRecordDateFileId(), {date: self.argsObj.record.humanReadableDate}); },
                'PlayingFileEnd': 'play_record_time',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //play_doctor_date

            play_record_time : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getRecordTimeFileId(), {time: self.argsObj.record.minutes}); },
                'PlayingFileEnd': 'ask_for_record_cancel',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //play_doctor_time

            ask_for_record_cancel: {
                _onEnter: function() { self.getAndPlayQuery( self.audioProvider.getRecordCancelQueryFileId());},
                'AskAgain': function (){ self.multiplyHandler.add('AskAgain');},
                'ReceiveFile': function (event){
                    self.multiplyHandler.reset();
                    self.getAndPlayPhraseWhateverResult( self.audioProvider.getThanksPhraseFileId(), null ,'ThanksPlayed');
                    self.detectAgreement( event.rate16000FilePath);
                },
                'Detected': function (agree){
                    if ( agree) {
                        self.multiplyHandler.add('YesDetected');
                    } else {
                        self.multiplyHandler.add('NoDetected');
                    }
                },
                'AskAgain..ThanksPlayed': function (){ self.askAgain ( 'repeatsRecordCancelNumber', 'recordAgreementQueryFilePath', self.audioProvider.getRecordCancelRepeatQueryFileId());},
                'ThanksPlayed..YesDetected': 'yes',
                'NoDetected..ThanksPlayed': 'goodbye',
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
            },//ask_for_record_cancel

            yes : {
                _onEnter: function() {
                    self.recordManager.cancelRecord( self.argsObj.record, function( err){});
                    self.fsm.transition( 'record_cancelled');
                },
                'CallEnded': 'exit'
            },

            no : {
                _onEnter: 'goodbye',
                'CallEnded': 'exit'
            },

            record_cancelled : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getRecordCancelledPhraseId()); },
                'PlayingFileEnd': 'goodbye',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            }, //goodbye

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
