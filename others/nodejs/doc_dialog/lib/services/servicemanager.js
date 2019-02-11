const settings = require('../settings/settings');

var known = {};
known.httpService ={};
known.service = {};

known.httpService.ClientManager             = require('./clientmanager');
known.httpService.GeoDetectionService       = require('./geodetectionservice');
known.httpService.RecordManager              = require('./recordmanager');
known.httpService.RouteService              = require('./routeservice');
known.httpService.SpeechRecognitionService  = require('./speechrecognitionservice');
known.httpService.AdminService = require('./adminservice');

known.service.CallConnection            = require('./callconnection');
known.service.AudioProvider             = require('../audio/audioprovider');
known.service.QueueService              = require('./queueservice');

const HTTPWrapper = require('./http/httpwrapper');

function _getHTTPService (serviceName, serviceSettings, scenario, options)
{
  options = options || {};  
  if (!options.httpWrapper) options.httpWrapper = new HTTPWrapper ( settings.httpWrapper);
  if (known.httpService[serviceName])
  {
    return new known.httpService[serviceName]( options.httpWrapper, scenario, serviceSettings);
  }
}

function get (serviceName, serviceSettings, scenario, options)
{
  serviceSettings = serviceSettings || settings.services;
  
  if (known.httpService[serviceName])
    return _getHTTPService(serviceName, serviceSettings, scenario, options);
    
  if (known.service[serviceName])
    return new known.service[serviceName](scenario, settings);
  
  return null;
}

module.exports.getClientManager            = function( scenario, settings,  httpWrapper){ return get('ClientManager',            settings, scenario, {httpWrapper:httpWrapper}); };
module.exports.getGeoDetectionService      = function( scenario, settings,  httpWrapper){ return get('GeoDetectionService',      settings, scenario, {httpWrapper:httpWrapper}); };
module.exports.getRecordManager             = function( scenario, settings,  httpWrapper){ return get('RecordManager',             settings, scenario, {httpWrapper:httpWrapper}); };
module.exports.getRouteService             = function( scenario, settings,  httpWrapper){ return get('RouteService',             settings, scenario, {httpWrapper:httpWrapper}); };
module.exports.getSpeechRecognitionService = function( scenario, settings,  httpWrapper){ return get('SpeechRecognitionService', settings, scenario, {httpWrapper:httpWrapper}); };
//module.exports.getTextToSpeechService      = function( scenario, settings,  httpWrapper){ return get('TextToSpeechService',      settings, scenario, {httpWrapper:httpWrapper}); }
module.exports.getAdminService = function( scenario, settings, httpWrapper){ return get('AdminService', settings, scenario, {httpWrapper:httpWrapper}); };

module.exports.getAudioProvider  = function( scenario, settings){ return get('AudioProvider',  settings, scenario); };
module.exports.getCallConnection = function( scenario, settings ){ return get('CallConnection', settings, scenario); };
module.exports.getQueueService = function( scenario, settings){ return get('QueueService', settings, scenario); };