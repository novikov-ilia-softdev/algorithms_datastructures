var esl = require('modesl');
var util = require( 'util');
var EventEmitter = require( 'events').EventEmitter;
var uuid = require('uuid');
var fs = require( 'fs');
var OtgoingCallManager = require('./outgoing_call/outgoingcallmanager');
var EventHelper = require( './eventhelper');
var FileHelper = require( './filehelper');

module.exports = FS_Server;
util.inherits( FS_Server, EventEmitter);

const CallEndedEvent = 'call_ended';
const IncomingCallEvent = 'incoming_call';
const UserSaidEvent = 'user_said';
const PlayFileFinishedEvent = 'play_file_finished';
const PickedUpEvent = 'picked_up';
const DTMFEvent = 'dtmf';
const BridgeAnsweredEvent = 'bridge_answered'
const BridgeEndedEvent = 'bridge_ended'

function FS_Server( module, settings){
    var self = this;
    self.module = module;
    self.settings = settings;
    self._clients = {};
    self._outgoingCallManager = null;
    self._eventHelper = new EventHelper();
    self._fileHelper = new FileHelper();
    
    self.registerClient = function ( scenario_id)
    {
        var client = uuid.v4();
        self._clients[ client] = {
            id : false,
            conn: false,
            scenario: scenario_id
        };
        return client;
    };

    self.run = function( callback){
        self.connection = new esl.Connection( self.settings.freeswitch.eslHost, self.settings.freeswitch.eslPort, self.settings.freeswitch.eslUser, function(err, info){
            if( !err)
            {
                self.connection.subscribe();
                self.es_server = new esl.Server({host: '0.0.0.0', port: 8085, myevents:true}, function(){
                    self.es_server.on( 'connection::ready', self._incomingCallHandler);
                });
                self._outgoingCallManager = new OtgoingCallManager( self.module, self.settings, self.connection);
                self.module.logger.notice( 'connection to fs established');
            }
            else{
                self.module.logger.alert( 'connection to fs failed');
            }

        });
        self.connection.once( 'error', function(e) {
            console.log( 'error', e);
            setTimeout( function(){}, 300000);
            self.module.logger.alert( 'error connection to fs');
        });
    };

    self._incomingCallHandler = function( conn, id){
        //console.log( conn.channelData);
        //conn.subscribe( 'CUSTOM conference::maintenance');
        conn.subscribe();
        var client = uuid.v4();
        var scenario = self.module.scenarioManager.register();
        self._clients[ client] = {
            id : id,
            conn: conn,
            scenario: scenario.getId()
        };
        
        scenario.callInfo( id, client, 'new call');
        conn.on('esl::end', function( evt, body) {
            self._clients[ client].id = false;
            self._clients[ client].conn = false;
            scenario.callInfo( id, client, 'call ended');
            self.emit( CallEndedEvent, client);
        });

        conn.on('error', function( evt, body) {
            self._clients[ client].id = false;
            self._clients[ client].conn = false;
            scenario.callInfo( id, client, 'call error');
            self.emit( CallEndedEvent, client);
        });

        self.emit( IncomingCallEvent, conn, client, scenario.getId());
    };

    self.handleCommandFromScript = function( command, client){
        if( command.hasOwnProperty( 'action')){
            if ( self._clients[ client].id) //has active call
            {
                switch (command.action)
                {
                    case 'answerCall': self._answer( client); break;
                    case 'finishCall': self._hangup( client); break;
                    case 'askUser'   :
                        self._play( client, command.filePath, function(){
                            self._getUserInput( client, command.userSayTimeoutMs, command.stopOnDTMF);
                        });
                        break;
                    case 'getDTMF'   :
                        self._play( client, command.filePath, function(){
                            self._getUserDTMF( client);
                        });
                        break;
                    case 'sayToUser' : self._play( client, command.filePath); break;
                    //case 'makeCall': self._makeNotificationCall (client, command.phone_number, command.file_path); break;
                    //default : error to client
                    case 'bridgeCall': self._bridgeCall( client, command.phone_number); break;
                    case 'playFiles' : self._playFiles( client, command.files); break;
                }
            }
            else
            {
                switch (command.action)
                {
                    case 'makeCall': self._makeCall (client, command.phone_number, command.from_phone_number); break;
                    case 'sayToUser' : self._play( client, command.filePath); break;
                    case 'finishCall': self._hangup( client); break;
                    /*TODO: case 'unregisterClient' */
                    //default : error to client
                }
            }
        }
        //else error to client
    };

    self._getUserInput = function( client, paramUserSayTimeoutMs, stopOnDTMF){
        var callee = null;
        var startSpeechTimeoutMs = paramUserSayTimeoutMs ? paramUserSayTimeoutMs : self.settings.userStartSpeechTimeoutMs;
        var stopSpeechTimeoutMs = self.settings.userStopSpeechTimeoutMs;

        if( !self._clients[ client].conn){
            self._getUserInputWithoutConnection( client);
            return;
        }

        var startSpeechTimeout = setTimeout( function(){
            self._unsubscribeOnEvents( client, callee);
            self.emit( UserSaidEvent, client, 'start_speech_timeout');

        }, startSpeechTimeoutMs);

        var stopSpeechTimeout = null;

        if( self._clients[ client].subscribed){
            self.emit( UserSaidEvent, client, 'already subscribed (error in prev operation)');
            return;
        }

        self._clients[ client].subscribed = true;
        var ignoreEvents = false;
        var ignoreEventsTimeout = null;
        self._clients[ client].conn.on( 'esl::event::**', function( event){
            callee = arguments.callee;

            if( self._eventHelper.isDTMFEvent( event)){
                clearTimeout( ignoreEventsTimeout);
                ignoreEvents = true;
                ignoreEventsTimeout = setTimeout( function(){ ignoreEvents = false; }, 2000);

                var digit = self._eventHelper.getDTMFDigit( event);
                if( digit == '0' && stopOnDTMF){
                    clearTimeout( startSpeechTimeout);
                    clearTimeout( stopSpeechTimeout);
                    self._unsubscribeOnEvents( client, callee);
                    self.emit( DTMFEvent, client, null, digit);
                }
            }

            if( ignoreEvents)
                return;

            if( self._eventHelper.isStartSpeechEvent( event)){
                clearTimeout( startSpeechTimeout);
                stopSpeechTimeout = setTimeout( function(){
                    self._unsubscribeOnEvents( client, callee);
                    self.emit( UserSaidEvent, client, 'stop_speech_timeout');

                }, stopSpeechTimeoutMs);

                return;
            }

            if( self._eventHelper.isStopSpeechEvent( event)){
                return;
            }

            if( self._eventHelper.isUserSaidEvent( event)){
                self._unsubscribeOnEvents( client, callee);
                clearTimeout( stopSpeechTimeout);
                var filePath = self._eventHelper.getUserSaidFilePathEvent( event)
                if( filePath)
                    self._onStopRecord( client, filePath, null, null);
            }
        });
    };

    self._getUserInputWithoutConnection = function( client){

        if( !self._clients[ client] || !self._clients[ client].id){
            self.emit( UserSaidEvent, client, 'no client with id');
            return;
        }

        var callee = null;
        var startSpeechTimeoutMs = self.settings.userStartSpeechTimeoutMs;
        var stopSpeechTimeoutMs = self.settings.userStopSpeechTimeoutMs;

        var startSpeechTimeout = setTimeout( function(){
            self.connection.removeListener( 'esl::event::**', callee);
            self.emit( UserSaidEvent, client, 'start_speech_timeout');
        }, startSpeechTimeoutMs);

        var id = self._clients[ client].id;
        var stopSpeechTimeout = null;
        self._executeConnection(client, self._clients[ client], 'vad');
        self.connection.on( 'esl::event::**', function( event){
            callee = arguments.callee;

            if( self._eventHelper.isStartSpeechEventForClient( event, id)){
                clearTimeout( startSpeechTimeout);
                stopSpeechTimeout = setTimeout( function(){
                    self.connection.removeListener( 'esl::event::**', callee);
                    self.emit( UserSaidEvent, client, 'stop_speech_timeout');

                }, stopSpeechTimeoutMs);

                return;
            }

            if( self._eventHelper.isUserSaidEventForClient( event, id)){
                self.connection.removeListener( 'esl::event::**', callee);
                clearTimeout( stopSpeechTimeout);
                var filePath = self._eventHelper.getUserSaidFilePathEvent( event)
                filePath ? self._onStopRecord( client, filePath, null, null) : self.emit( UserSaidEvent, client, 'no file path in use said event');
            }
        });
    };

    self._getUserDTMF = function( client){
        var callee = null;
        var DTMFTimeoutMs = self.settings.DTMFTimeoutMs;

        if( !self._clients[ client].conn){

            var DTMFTimeout = setTimeout( function(){
                if( callee){
                    self.connection.removeListener( 'esl::event::**', callee);
                }
                self.emit( DTMFEvent, client, 'timeout');

            }, DTMFTimeoutMs);

            self._executeConnection(client, self._clients[ client], 'spandsp_start_dtmf', null, function( res){
                self.connection.on( 'esl::event::**', function( event){
                    callee = arguments.callee;

                    var id;
                    if( self._clients[ client])
                        id = self._clients[ client].id

                    if( self._eventHelper.isDTMFForClient( event, id)){
                        var digit = self._eventHelper.getDTMFDigit( event);
                        clearTimeout( DTMFTimeout);
                        self.connection.removeListener( 'esl::event::**', callee);
                        self.emit( DTMFEvent, client, null, digit);
                    }
                })
            });

            return;
        }

        var DTMFTimeout = setTimeout( function(){
            self._unsubscribeOnEvents( client, callee);
            self.emit( DTMFEvent, client, 'timeout');

        }, DTMFTimeoutMs);

        if( self._clients[ client].subscribed){
            self.emit( DTMFEvent, client, 'already subscribed (error in prev operation)');
            return;
        }

        self._clients[ client].subscribed = true;
        self._clients[ client].conn.on( 'esl::event::**', function( event){
            callee = arguments.callee;

            if( self._eventHelper.isDTMFEvent( event)){
                clearTimeout( DTMFTimeout);
                var digit = self._eventHelper.getDTMFDigit( event);
                self._unsubscribeOnEvents( client, callee);
                self.emit( DTMFEvent, client, null, digit);
            }
        });
    };

    self._onStopRecord = function( client, filePath){

        var fileForSpeechRecognition = filePath;
        var fileForDriver = filePath;

	    self.emit( UserSaidEvent, client, null, filePath, fileForSpeechRecognition, fileForDriver)
    };
    
    self._answer = function( client){
        self._executeConnection(client, self._clients[ client], 'answer');
        self._executeConnection(client, self._clients[ client], 'vad');
        self._executeConnection(client, self._clients[ client], 'spandsp_start_dtmf');
    };

    self._hangup = function( client){
        self._executeConnection(client, self._clients[ client], 'hangup');
    };

    self._play = function( client, filePath, callback){
        self._playInChannel( client, filePath, callback);
    };

    self._playFiles = function( client, files, callback){
        var delimiter = '!'
        var filesStr = files.join( delimiter);
        self._executeConnection(client, self._clients[ client], 'set', 'playback_delimiter=' + delimiter);
        self._executeConnection(client, self._clients[ client], 'set', 'playback_sleep_val=0');
        self._playInChannel( client, filesStr, callback);
    };

    self._playInChannel = function( client, filePath, callback){
        if( !filePath){
            self.emit( PlayFileFinishedEvent, client, 'filePath not passed');
            return;
        }

        self._fileHelper.getFileDuration( filePath, function( err, durationMs){
            if( !err){
                if( !callback){
                    var startTime = new Date();
                    self._executeConnection(client, self._clients[ client], 'playback', filePath, function(){
                        if( new Date() - startTime < durationMs / 2)
                            self.emit( PlayFileFinishedEvent, client, 'no_listen', filePath);
                        else
                            self.emit( PlayFileFinishedEvent, client, null, filePath);
                    });
                }
                else{
                    self._executeConnection(client, self._clients[ client], 'playback', filePath);
                    setTimeout( function(){
                        self.emit( PlayFileFinishedEvent, client, null, filePath);
                        callback();

                    }, durationMs - 1200);
                }
            }
            else{
                self.emit( PlayFileFinishedEvent, client, 'error get file duration', filePath);
            }
        })
    };
    
    self._makeCall = function(client, phoneNumber, from_phone_number, callback) {

        var scenario = self.module.scenarioManager.get(self._clients[ client].scenario);

        var callResultCallback = function( id, isAnswered, logInfo){
            if( isAnswered) {
                scenario.callInfo( id, client, 'call pickedup');
                scenario.outCallInfo( id, client, 'out call answered', logInfo);
                self.emit( PickedUpEvent, client);
                self._clients[ client].id = id;

            } else {
                scenario.callInfo('--', client, 'out call failed');
                scenario.outCallInfo( '--', client, 'out call not answered', logInfo);
                self.emit( CallEndedEvent, client);
            }
        };

        var answeredCallEndedCallback = function( id, logInfo){
            scenario.callInfo( id, client, 'call ended');
            //scenario.outCallInfo( id, client, 'answered call ended', logInfo);
            self._clients[ client].id = null;
            self.emit( CallEndedEvent, client);
        };

        var callbacksObj = {
            'callResultCallback': callResultCallback,
            'answeredCallEndedCallback': answeredCallEndedCallback };

        self._outgoingCallManager.call( phoneNumber, from_phone_number, callbacksObj);
    };

    self._bridgeCall = function( client, phoneNumber) {
        var callee = null;

        if( !self._clients[ client] || !self._clients[ client].conn)
            return;

        var gateway = self._eventHelper.getGatewayOnConnection( self._clients[ client].conn.channelData);

        self._executeConnection( client, self._clients[ client], 'set', 'continue_on_fail=true', function(){
            self._subscribeOnEvents( client, function( event, body) {
                if( event.type == 'CALL_UPDATE'){
                    callee = arguments.callee;
                    self.emit( BridgeAnsweredEvent, client);
                    self._unsubscribeOnEvents( client, callee);
                }
            });

            var bridgeCommand = 'bridge';
            //phoneNumber = '1234@192.168.0.148:5100'
            var bridgeArgs = '{bypass_media=true}sofia/gateway/' + gateway + '/' + phoneNumber;

            self._executeConnection( client, self._clients[ client], bridgeCommand, bridgeArgs, function(){
                self.emit( BridgeEndedEvent, client);
                self._unsubscribeOnEvents( client, callee);
            });
        });
    };

    self._subscribeOnEvents = function( client, callback){
        if( self._clients[ client] && self._clients[ client].conn && callback){
            self._clients[ client].conn.on( 'esl::event::**', callback);
        }
    };

    self._unsubscribeOnEvents = function( client, callee){
        if( self._clients[ client] && self._clients[ client].conn && callee){
            self._clients[ client].conn.removeListener( 'esl::event::**', callee);
            self._clients[ client].subscribed = false;
        }
    };

    self._executeConnection = function( client, call, command, value, callback){
        if (call) {
            var scenario = self.module.scenarioManager.get(call.scenario);
            scenario.callInfo( call.id, client, command, value);
            if( call.conn) {
                call.conn.execute(command, value, callback);
            } else if( call.id) {
                self.connection.execute(command, value, call.id, callback);
            }
        } else {
            self.module.logger.error ('unable to exec ' + command + ' for client ' + client + 'call not exists');
        }
    };
}