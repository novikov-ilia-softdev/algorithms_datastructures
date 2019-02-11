const _        = require('underscore');
const conf     = require('../settings/settings');

var Logger = {
  _logger: null,
  
  override : function (logger_instance){
    this._logger = logger_instance;
  },
  
  getLoger: function (){
    if (! this._logger){
      if (! conf.logger.enable) this._logger = { emit: function(){}, end: function(){}};
      else this._logger = require('fluent-logger').createFluentSender(conf.logger.tag, conf.logger.connection);
    }
    return this._logger;
  },
  
  log: function ( msg, level, index){
    index = index || "";    
    
    m = {};
    if (typeof msg == 'string')
      m.log_message = msg;
    else
      m = msg;
      
    m.log_level = level;
    
    if (! m.log_timestamp){
      m.log_timestamp = Date.now()/1000;
    }
    
    var logger = this.getLoger();
    logger.emit( index, m);
  },

  end: function (){
    if (this._logger)
      this._logger.end();
  },
  
  trace: function (msg) {
    //very detailed logs, which may include high-volume information such as protocol payloads. This log level is typically only enabled during development
    this.log ( msg, "trace")
  },
  
  debug: function (msg) {
    //debugging information, less detailed than trace, typically not enabled in production environment
    this.log ( msg, "debug")
  },
  
  info: function (msg) {
    //information messages, which are normally enabled in production environment
    this.log ( msg, "info")
  },
  
  notice: function (msg) { 
    //information messages, which are always enabled in production environment, such as start/stop/reconfigure/status_of application
    this.log ( msg, "notice")
  },
  
  warning: function (msg) {
    //anything that can potentially cause an application limitation, such as license expiring, switching from a primary to backup server, retrying an operation etc. Usually an automatic recovery is defined for such situations 
    this.log ( msg, "warning")
  },
  
  error: function (msg) { 
    //any error fatal to the operation but not to the application itself such as, cannot open file, missing data, input data format incorrect, etc
    this.log ( msg, "error")
  },
  
  alert: function (msg) { 
    //any error that can potentially become a fatal and needs urgent correction
    this.log ( msg, "alert")
  },
  
  fatal: function (msg) {
    //any error that forces application to shut down and may result in data corruption or loss 
    this.log ( msg, "fatal")
  },
    
  paramsToKeyValue: function (params_obj)
  {
    return _.chain(params_obj)
            .pairs()
            .map((pair) => {
              return {
                "key": String(pair[0]),
                "val": String(pair[1])
              };
            })
            .value();
  }
};



module.exports = Logger;