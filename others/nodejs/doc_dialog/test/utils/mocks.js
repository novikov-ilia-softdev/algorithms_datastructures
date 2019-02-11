const _ = require("underscore");
const EventEmitter = require( "events").EventEmitter;
const util         = require( "util");
const path         = require( "path");

module.exports = {};
//services
module.exports.getAudioProviderMock = getAudioProviderMock;
module.exports.getCallConnectionMock = getCallConnectionMock;
module.exports.getClientManagerMock = getClientManagerMock;
module.exports.getGeoDetectionServiceMock = getGeoDetectionServiceMock;
module.exports.getRecordManagerMock = getRecordManagerMock;
module.exports.getRouteServiceMock = getRouteServiceMock;
module.exports.getSpeechRecognitionServiceMock = getSpeechRecognitionServiceMock;
module.exports.getServiceManagerMock = getServiceManagerMock;
module.exports.getAdminServiceMock = getAdminServiceMock;
module.exports.getQueueServiceMock = getQueueServiceMock;
//main module
module.exports.getModuleMock = getModuleMock;

//scenario
module.exports.getScenarioMock = getScenarioMock;

//secondary mocks
//module.exports.createRecordMock = createRecordMock;


function getAdminServiceMock (){
  return {
    validate : function(){
      return new Promise( (resolve, reject) => {
        setTimeout(() => {
          reject();
        }, 10);
      });
    }
  };
}

function getQueueServiceMock() {
  return {
    init: function(){},
    handle: function(){}
  };
}

function getAudioProviderMock (){
  AudioProvider = {
    getFile: function (phraseId, data, callback){ callback(null, (Math.random() * 10000) + "_got_filename");},
    init: function (callback){ callback();}
  };
  
  require('../../lib/audio/fileidsmixins').extend(AudioProvider);
  return AudioProvider;
}

function  _CallConnectionMock (){
  var self = this;
  self.dtmf = '2';
  self.shouldDoctorAnswer = true;

  self._getPlayEvent = function (filePath){
    var fileName = path.basename( filePath);
    return 'PlayingFileEndEvent'+fileName;
  }
  self.playPhrase=function( filePath){
    self.emit(self._getPlayEvent(filePath), {filePath:filePath});
  }
  self.playQuery=function( filePath, userSayTimeoutMs, stopOnDTMF){
    self.emit(self._getPlayEvent(filePath), {filePath: filePath});
    var outFilePath = (Math.random() * 10000) + "_recv_filename";
    self.emit('ReceiveFileEvent', {
      originalFilePath:outFilePath,
      rate16000FilePath:outFilePath,
      amrFilePath: outFilePath
    });
  }
  self.finishCall=function(){ self.emit('CallEndedEvent');}
  self.answer=function( callback){ callback(null, "info");}
  self.makeCall=function (phone_number, callback){ self.emit("PickedUpEvent");}
  self.getCityInfo=function(){ self.emit("CityInfoEvent", {id:1});}
  self.playDTMFQuery=function(){ self.emit("dtmf", { err: null, digit: self.dtmf});}
  self.bridgeCall=function (phone_number, callback){ if( self.shouldDoctorAnswer) self.emit("BridgeAnswered"); self.emit("BridgeEnded");}
  self.activateEvents = function (){}
  self.deactivateEvents = function (){}
};

util.inherits( _CallConnectionMock, EventEmitter);

function getCallConnectionMock(){
  return new _CallConnectionMock();
}

function getClientManagerMock(){
  return {
    getInfo : function (phoneNumber, callback, scenario) { callback( null,'info')},
    saveClientInfo : function (name, phone_number, city_id, callback, scenario) { callback( null, { user_id: 1}); },
    notifyAboutCallResult: function( name, order_id, call_result, callback, scenario) { callback (null, 'notified')},
    notifyAboutVoiceMessage: function( user_id, record_filename, callback, scenario){ callback (null, 'notified')},
    notifyAboutCallsResult: function( name, order_id, call_result, callback, scenario) { callback (null, 'notified')},
    notifyAboutDriverRating: function( order_id, rating, callback, scenario) { callback (null, 'notified')}
  };
}

function getGeoDetectionServiceMock(){
  return {
    detectCoordinates : function( file, callback, scenario) { callback( null,'coordinates')},
    detectCoordinatesByText : function( text, city_d, callback, scenario) { callback( null,{ from: {point: { lat: 53.190424, lng: 43.975525 },address: 'улица Суворова, 1'},from_text: ' Суворова 1',to: {point: { lat: 53.191282, lng: 43.981956 },address: 'улица Суворова, 29'},to_text: ' Суворова 29' })}
  };
}

function getRecordManagerMock(){
  return  {
    createRecord: function( doctor_phone, patient_phone, record_file, callback) { callback( null, 'record');},
    cancelRecord: function( orderInfo, callback) { callback (null, 'canceled');},
  };
}

function getRouteServiceMock(){
  return {
    getRouteInfo: function( location, destination, callback){ callback( null,"routeInfo");},
    getPublicTransportInfo: function( location, destination, callback){ callback( null,"PublicTransportInfo");}
  };
}

function getSpeechRecognitionServiceMock(){
   return {
    detectName: function ( file, callback) { callback( null,"name");},
    detectAgreement: function( file, callback) { callback( null, true);},
    simpleRecognize: function( file, callback) { callback( null, {success:true, variants:[ { text: 'Суворова 1 Суворова 29', confidence: 0.9736841 }]});}
  };
}

function getServiceManagerMock (){
  this.AudioProvider = getAudioProviderMock();
  this.CallConnection = getCallConnectionMock();
  this.ClientManager = getClientManagerMock();
  this.GeoDetectionService = getGeoDetectionServiceMock();
  this.RecordManager = getRecordManagerMock();
  this.RouteService = getRouteServiceMock();
  this.SpeechRecognitionService = getSpeechRecognitionServiceMock();
  this.AdminService = getAdminServiceMock();
  this.QueueService = getQueueServiceMock();
  
  this.getAudioProvider = function() { return this.AudioProvider; };
  this.getCallConnection = function() { return this.CallConnection; };
  this.getClientManager = function() { return this.ClientManager; };
  this.getGeoDetectionService = function() { return this.GeoDetectionService; };
  this.getRecordManager = function() { return this.RecordManager; };
  this.getRouteService = function() { return this.RouteService; };
  this.getSpeechRecognitionService = function() { return this.SpeechRecognitionService; };
  this.getAdminService = function () { return this.AdminService; };
  this.getQueueService = function() { return this.QueueService; };
  return this;
}

function getModuleMock(){
  return {};
}

function getScenarioMock(){
  return {
    processStart: function (){},
    processMessage: function (){},
    getId: function (){ return "bad1d47357"; /* "bad id for test" - leet*/},
    toString: function () { return '"bad1d47357~test"';},
    end: function(){}
  }
}

function createOrderMock (order){
  return _.defaults( order || {}, 
    {
      id:1,
      from_text:'A',
      from_geo_text:'A',
      from_location_record:'',
      to_text:'B',
      to_geo_text:'B',
      to_location_record:'',
      time:1000,
      distance:1000,
      price:1000,
      user_id: 1,
      driver_id: 1,
      done : false,
      status: 'accept',
      discounts:[] // array of {description:xxxx, value:xxx}
    });
}

/* To remember !!!
    script.fsm.on("transition", data => console.log(data.toState));
    script.fsm.on("handling", data => console.log('  ',data.inputType));
    script.fsm.on("nohandler", data => console.log('---',data.inputType));
    script.fsm.on("deffered", data => console.log('>>>',data));
*/