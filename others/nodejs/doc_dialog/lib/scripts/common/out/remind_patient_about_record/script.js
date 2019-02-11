module.exports = Script;

var machina = require('machina');
var ceHelper = require('../../../utils/connectioneventhelper');
var path = require('path');

function Script( argsString){
    var self = this;

    self.argsObj = JSON.parse( argsString);
    self.serviceManager = require('../../../../services/servicemanager');
    self.waitTimeoutMs = 3000;
    self.scriptName = 'remind_patient_about_record'

    self.run = function(){
      self.scenario = require('../../../../scenario/scenariomanager').parse( JSON.stringify( self.argsObj.scenario));
      self.scenario.setPathSuffix( 'patient_without_record');
      self.audioProvider = self.serviceManager.getAudioProvider( self.scenario);
      self.callConnection = self.serviceManager.getCallConnection( self.scenario);
      self.clientManager  = self.serviceManager.getClientManager( self.scenario);
      self.listeners = ceHelper.activate( self.callConnection, self.fsm);

      require('../../../utils/commonmixins').extend( self);

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
              _onEnter : function() { this.transition('calling'); },
              '*': function() { this.deferUntilTransition(); }
            },//start

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
                        self.fsm.transition('play_greetings');
                    }, self.waitTimeoutMs);
                }, //3s

                'CallEnded': 'exit'
            },

            play_greetings:{
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getHelloPatientFileId(), {name: self.argsObj.doctor.description});},
                'PlayingFileEnd': 'play_doctor_info',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },

            play_doctor_info : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getDoctorInfoFileId(), {name: self.argsObj.doctor.name}); },
                'PlayingFileEnd': 'play_record_date',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },

            play_record_date : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getRecordDateFileId(), {date: self.argsObj.record.humanReadableDate}); },
                'PlayingFileEnd': 'play_record_time',
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },

            play_record_time : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getRecordTimeFileId(), {time: self.argsObj.record.minutes}); },
                'PlayingFileEnd': function(){
                    self.clientManager.notifyAboutCallResult( self.scriptName, self.argsObj.record.id, 'success', function(){
                        self.fsm.transition( 'happy_to_help');
                    }, self.scenario);
                },
                'ErrPlayingFile': 'report_error',
                'ErrFileName': 'report_error',
                'CallEnded': 'exit'
            },

            happy_to_help : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getHappyToHelpFileId()); },
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
            }, //goodbye

            hangup : {
                _onEnter: function(){ self.callConnection.finishCall(); },
                'CallEnded' : 'exit'
            },

            report_error : {
                _onEnter: function() { self.getAndPlayPhrase( self.audioProvider.getTalkErrorPhraseFileId()); },
                'ErrFileName': 'hangup',
                'PlayingFileEnd': 'hangup',
                'CallEnded': 'exit'
            },

            exit : {
                _onEnter: function() { ceHelper.deactivate( self.callConnection, self.listeners); if ( self.scenario) self.scenario.end();
                }
            }
        }
    });//fsm

} //Script
