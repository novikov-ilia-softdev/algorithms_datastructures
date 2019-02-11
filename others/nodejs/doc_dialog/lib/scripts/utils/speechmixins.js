const _  = require('underscore');

/**
 * mixin functions for scripts
 * 
 * script must have properties:
 *  
 * fsm                       - machina.Fsm
 * speechRecognitionService  - speechRecognitionService
 */

var mixins = function (global_options) {
  var self = this;
  global_options = global_options || {};
  
  global_options = _.defaults( global_options, {
    detectedSpeechEvent    : "DetectedSpeech",
    nameDetectedEvent      : "Detected",
    agreementDetectedEvent : "Detected",
    repeatEvent            : "AskAgain",
    unknownErrorEvent      : "UnknownError"
  });

  this.detectName = function (filePath, options){
    options = _.defaults ( options || {}, global_options);
    
    self.speechRecognitionService.detectName (filePath, function (err, name) {
      if( err) {
        self.fsm.handle( options.repeatEvent, err);
      } else if ( name) {
        self.fsm.handle( options.nameDetectedEvent, name);
      } else {
        self.fsm.handle( options.unknownErrorEvent);
      };
    });
  }
  
  this.detectAgreement = function (filePath, options){
    options = _.defaults ( options || {}, global_options);
    
    self.speechRecognitionService.detectAgreement (filePath, function (err, agree) {
      if( err) {
        self.fsm.handle( options.repeatEvent, err);
      } else {
        self.fsm.handle( options.agreementDetectedEvent, agree);
      };
    });
  }

  this.simpleRecognize = function (filePath, options){
    options = _.defaults ( options || {}, global_options);
    
    self.speechRecognitionService.simpleRecognize (filePath, function (err, data) {
      if( err) {
        self.fsm.handle( options.repeatEvent, err);
      } else if ( data) {
        self.fsm.handle( options.detectedSpeechEvent, data);
      } else {
        self.fsm.handle( options.unknownErrorEvent);
      };
    });
  }
}

module.exports = {};

module.exports.extend = function (dest, options) {
  mixins.call(dest, options);
}
