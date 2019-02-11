const _  = require('underscore');

/**
 * mixin functions for scripts
 * 
 * script must have properties:
 *  
 * fsm           - machina.Fsm
 * routeService  - routeService 
 */

var mixins = function (global_options) {
  var self = this;
  global_options = global_options || {};
  
  global_options = _.defaults( global_options, {
    gotPublicTransportInfo : "GotInfo",
    errPublicTransportInfo : "ErrInfo",
    unknownErrorEvent      : "UnknownError"
  });
  
  
  this.getPublicTransportInfo = function (fromLocation, toLocation, options){
    options = _.defaults ( options || {}, global_options);
    
    self.routeService.getPublicTransportInfo (fromLocation, toLocation, function (err, info) {
      if( err) {
        self.fsm.handle( options.errPublicTransportInfo, err);
      } else if ( info) {
        self.fsm.handle( options.gotPublicTransportInfo, info);
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
