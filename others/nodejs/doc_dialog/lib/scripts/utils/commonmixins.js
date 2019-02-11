const _  = require('underscore');
var path = require( "path");

/**
 * mixin functions for scripts
 * 
 * script must have properties:
 *  
 * fsm             - machina.Fsm
 * audioProvider   - audioProvider
 * callConnection  - callConnection
 */

var mixins = function (global_options) {
  
  var self = this;
  global_options = global_options || {};
  global_options = _.defaults( global_options, {
    gotFileNameEvent    : "GotFileName",
    errFileNameEvent    : "ErrFileName",
    maxRepeatsEvent     : "MaxRepeats",
    gotAnswerEvent      : "GotAnswerCall",
    errAnswerEvent      : "ErrAnswerCall",
    playingFileEndEvent : "PlayingFileEnd",
    errPlayingFileEvent : "ErrPlayingFile",
    receiveFileEvent    : "ReceiveFile",
    errReceiveFileEvent : "ErrReceiveFile",
    unknownErrorEvent   : "UnknownError",
    maxRepeats : 1
  });

  this.answer = function ( options, callfn) {
    options = _.defaults ( options || {}, global_options);
    
    self.callConnection.answer( function (err, info) {
      if (err) {
        self.fsm.handle( options.errAnswerEvent, err, info);
      } else {
        self.fsm.handle( options.gotAnswerEvent, info);
        if (callfn){
          callfn (info);
        }
      }
    });
  }
  
  this.getFile = function ( fileId, params, options, callfn){
    options = _.defaults ( options || {}, global_options);
    params = params || "";
    
    self.audioProvider.getFile(fileId, params, function(err, filePath){
      if( err || !filePath) {
        self.fsm.handle(options.errFileNameEvent,  err, filePath);
      } else {
        self.fsm.handle(options.gotFileNameEvent, filePath);
        if (callfn){
          callfn (filePath);
        }
      }
    });
  };

  this.playQuery = function(options, userSayTimeoutMs, stopOnDTMF)
  {
    options = _.defaults ( options || {}, global_options);
    return function (filePath){

      function dtmffunc (event)
      {
        if (event && event.digit == '0') clearListeners();
      }

      function receivefunc (event){
         clearListeners();
         if (!event)  return self.fsm.handle( options.unknownErrorEvent);
         if (event.err) return self.fsm.handle( options.errReceiveFileEvent, event.err);
         self.fsm.handle(options.receiveFileEvent, event);
      };

      function clearListeners (){
         self.callConnection.removeListener("ReceiveFileEvent", receivefunc);
         self.callConnection.removeListener("dtmf",dtmffunc);
      }

      self.callConnection.once("ReceiveFileEvent", receivefunc);

      if (stopOnDTMF) {
        self.callConnection.addListener("dtmf",dtmffunc);
      }

      self.callConnection.once("PlayingFileEndEvent", (event) => {
        if (!event) {
          clearListeners();
          return self.fsm.handle( options.unknownErrorEvent);
        }
        if (event.err) {
          clearListeners();
          return self.fsm.handle( options.errPlayingFileEvent, event.err);
        }
        if (event.filePath == filePath) {
          return self.fsm.handle( options.playingFileEndEvent, event);
        } else {
          clearListeners();
          return self.fsm.handle( options.errPlayingFileEvent, "wrong file expected:"+filePath+" actual:"+event.filePath);
        }
      });
      
      self.callConnection.playQuery(filePath, userSayTimeoutMs, stopOnDTMF);
    }
  }

  this.playDTMFQuery = function(options, userSayTimeoutMs, stopOnDTMF)
  {
    options = _.defaults ( options || {}, global_options);
    return function (filePath){

      function dtmffunc (event)
      {
        if (event && ! event.digit == '0') clearListeners();
      }

      function clearListeners (){
        self.callConnection.removeListener("dtmf",dtmffunc);
      }

      self.callConnection.addListener("dtmf",dtmffunc);

      self.callConnection.playDTMFQuery(filePath);
    }
  }



  this.playPhrase = function ( options)
  {
    options = _.defaults ( options || {}, global_options);
    return function(filePath) {
      var fileName = path.basename( filePath);
      self.callConnection.once("PlayingFileEndEvent"+fileName, (event) => {

        if (!event) return self.fsm.handle( options.unknownErrorEvent);
        if (event.err) return self.fsm.handle( options.errPlayingFileEvent, event.err);

        return self.fsm.handle( options.playingFileEndEvent, event);
      });
      self.callConnection.playPhrase(filePath);
    }
  }

  this.playFiles = function ( options)
  {
    options = _.defaults ( options || {}, global_options);
    return function(files) {
      self.callConnection.once( "PlayingFileEndEvent", (event) => {

        if (!event) return self.fsm.handle( options.unknownErrorEvent);
        if (event.err) return self.fsm.handle( options.errPlayingFileEvent, event.err);

        return self.fsm.handle( options.playingFileEndEvent, event);
      });
      self.callConnection.playFiles( files);
    }
  }
  
  this.getAndPlayQuery = function ( fileId, params, options, userSayTimeoutMs, stopOnDTMF){
    this.getFile (fileId, params, options, this.playQuery(options, userSayTimeoutMs, stopOnDTMF));
  };

  this.getAndPlayDTMFQuery = function ( fileId, params, options){
    this.getFile (fileId, params, options, this.playDTMFQuery(options));
  };
    
  this.getAndPlayPhrase = function ( fileId, params, options){
    this.getFile (fileId, params, options, this.playPhrase(options));
  };

  this.getAndPlayPhraseWhateverResult = function (fileId, params, EventName, options){
    EventName = EventName || global_options.playingFileEndEvent;
    options = _.defaults ( options || {}, {
      errFileNameEvent    : EventName,
      playingFileEndEvent : EventName,
      errPlayingFileEvent : EventName,
      unknownErrorEvent   : EventName
    });
    this.getAndPlayPhrase(fileId, params, options);
  }
    
  this.askAgain = function ( counterVarName, filePathVarName, repeatFileId, params, options){
    options = _.defaults ( options || {}, global_options);
    
    if( !self[counterVarName]){
      self[counterVarName] = 1;
      self[filePathVarName] = false;
    } else
      self[counterVarName]++;
    
    if( self[counterVarName] > options.maxRepeats) {
      self.fsm.handle(options.maxRepeatsEvent,  self[counterVarName]);
      return;
    }
    
    if( !self[filePathVarName]){
      self.getAndPlayQuery( repeatFileId, params, options);
    } else {
      self.playQuery(options)(self[filePathVarName]);
    }
  };

  this.askDTMFAgain = function ( counterVarName, filePathVarName, repeatFileId, params, options){
    options = _.defaults ( options || {}, global_options);

    if( !self[counterVarName]){
      self[counterVarName] = 1;
      self[filePathVarName] = false;
    } else
      self[counterVarName]++;

    if( self[counterVarName] > options.maxRepeats) {
      self.fsm.handle(options.maxRepeatsEvent,  self[counterVarName]);
      return;
    }

    self.getAndPlayDTMFQuery( repeatFileId, params, options);
  };
  
  return this;
}

module.exports = {};

module.exports.extend = function (dest, options) {
  mixins.call(dest, options);
}

