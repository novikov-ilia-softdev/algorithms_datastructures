var EventEmitter = require( "events").EventEmitter;

var path = require( "path");
var util = require( "util");
util.inherits( CallConnection, EventEmitter);

module.exports = CallConnection;

function CallConnection(scenario, settings){
    var self = this;

    self.playFileFinished = "play_file_finished";
    self.userSaid = "user_said";
    self.callEnded = "call_ended";
    self.pickedUp = "picked_up";
    self.dtmf = "dtmf";
    self.bridgeAnswered = "bridge_answered";
    self.bridgeEnded = "bridge_ended";

    self.messageHandler = function (data){

        if( data.hasOwnProperty("event")) {
            switch (data.event) {
                case self.callEnded        : self.emit("CallEndedEvent"); break;
                case self.pickedUp         : self.emit("PickedUpEvent"); break;
                case self.playFileFinished :
                    var fileName = path.basename( data.filePath);
                    self.emit("PlayingFileEndEvent", { filePath: data.filePath, err: data.err});
                    self.emit("PlayingFileEndEvent"+fileName, { filePath: data.filePath, err: data.err});
                    break;
                case self.userSaid         : self.emit("ReceiveFileEvent", { originalFilePath:data.originalFilePath, rate16000FilePath: data.rate16000FilePath, err: data.err, amrFilePath: data.amrFilePath}); break;
                case self.dtmf             : self.emit("dtmf", { err: data.err, digit: data.digit}); break;
                case self.bridgeAnswered   : self.emit("BridgeAnswered"); break;
                case self.bridgeEnded      : self.emit("BridgeEnded"); break;
            }
        }
    }

    self.activateEvents = function (){
       process.on('message', self.messageHandler);
    }

    self.deactivateEvents = function (){
        process.removeListener('message', self.messageHandler);
    }

    self.answer = function( callback){
        process.send({ action: "answerCall"});
        if (callback)
            callback();
    }

    self.playPhrase = function( file){
        process.send({ action: "sayToUser", filePath: file});
    }

    self.playFiles = function( files){
        process.send({ action: "playFiles", files: files});
    }

    self.playQuery = function( file, userSayTimeoutMs, stopOnDTMF){
        process.send({ action: "askUser", filePath: file, userSayTimeoutMs: userSayTimeoutMs, stopOnDTMF: stopOnDTMF});
    }

    self.playDTMFQuery = function( file){
        process.send({ action: "getDTMF", filePath: file});
    }

    self.finishCall = function( callback){
        process.send({ action: "finishCall"});
        if (callback)
            callback();
    }

    self.makeCall = function (phone_number, file_path, from_phone_number, callback){
        process.send({ action: "makeCall", "phone_number":phone_number, "file_path": file_path, "from_phone_number": from_phone_number});
        if (callback)
            callback();
    }

    self.bridgeCall = function (phone_number, callback){
        process.send({ action: "bridgeCall", phone_number: phone_number});
        if (callback)
            callback();
    }
}
