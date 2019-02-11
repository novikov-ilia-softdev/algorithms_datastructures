
const path    = require('path');
const logger  = require('../log/logger');

function Scenario (id, path)
{
  this._id = id;
  this._path= path;
  this._path_suffix= "voiced";  
};

Scenario.prototype.getId = function ()
{
  return this._id;
}

Scenario.prototype.setPathSuffix = function (suffix){
  suffix = suffix || "";
  this._path_suffix = suffix;
}
 
Scenario.prototype.getPath = function (){
    return this._path + this._path_suffix;
};
  
Scenario.prototype.addToLogMessage =  function (message){
    message = message || {};
    message.scenario = this.getId();
    message.scenario_path = this.getPath();
    return message;
};

Scenario.prototype.addToServiceParams =  function (params){
    params = params || {};
    params.scenario = this.getId();
    params.scenario_path = this.getPath();
    return params;
};

Scenario.prototype.toString = function (){
  return '"'+this.getId() + '~'+ this.getPath()+'"';
}

ScenarioParamsFromString = function (str){
  str = str.replace(/"/g,'');
  var vals = str.split('~');
  if (vals && vals.length==2){
     return {scenario: vals[0], scenario_path:vals[1]};
  }
  return {};
}

Scenario.prototype.processStart = function (scriptName, scriptArgs, child){
  var message = { 
    case: "start child process",
    pid: child.pid,
    script_name: path.basename(scriptName),
    script_args: scriptArgs.join(' '),
    script_fullname: scriptName
  };
  
  message = this.addToLogMessage(message);
  logger.log( message, "info", "process");
}

Scenario.prototype.processMessage = function (child, message, params, direction){
  var message = { 
    case: "child process message",
    pid: child.pid,
    direction: direction,
    message: JSON.stringify(message),    
  };
  
  if (params) {
    message.params = JSON.stringify(params);
  }
  
  message = this.addToLogMessage(message);
  logger.log( message, "info", "process");
}

Scenario.prototype.callInfo = function (call_id, client_id, action, params){
  params = params || "";
  var message = { 
    action: action,
    call: call_id,
    client: client_id,
    params: String(params),
  };
  
  message = this.addToLogMessage(message);
  logger.log( message, "info", "call");
}

Scenario.prototype.outCallInfo = function (call_id, client_id, action, params){
  params = params || "";
  var message = {
    action: action,
    call: call_id,
    client: client_id,
    params: JSON.stringify(params),
  };

  message = this.addToLogMessage(message);
  logger.log( message, "info", "outcall");
}

Scenario.prototype.commonError = function ( err){
  var message = { common_error: JSON.stringify(err)};

  message = this.addToLogMessage(message);
  logger.log( message, "error", "common");
}

Scenario.prototype.audioProvider = function (message, error){
   var message = { 
    message: String(message)
  };
  message = this.addToLogMessage(message);
  if (error) {
    message.error_msg = String(error);
    logger.log( message, "error", "audioProvider");
  } else {
    logger.log( message, "info", "audioProvider");
  }
}

Scenario.prototype.ttsEngine = function (message, error){
   var message = {
    message: String(message)
  };
  message = this.addToLogMessage(message);
  if (error) {
    message.error_msg = String(error);
    logger.log( message, "error", "ttsEngine");
  } else {
    logger.log( message, "info", "ttsEngine");
  }
}

Scenario.prototype.end = function (){
  logger.end();
}

module.exports = {};
module.exports.Scenario = Scenario;
module.exports.ScenarioParamsFromString = ScenarioParamsFromString;