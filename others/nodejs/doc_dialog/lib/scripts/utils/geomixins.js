const _  = require('underscore');

/**
 * mixin functions for scripts
 * 
 * script must have properties:
 *  
 * fsm                  - machina.Fsm
 * geoDetectionService  - geoDetectionService 
 */

var mixins = function (global_options) {
  var self = this;
  global_options = global_options || {};
  
  global_options = _.defaults( global_options, {
    coordinatesDetectedEvent : "Detected",
    repeatEvent              : "AskAgain",
    unknownErrorEvent        : "UnknownError"
  });
  
  
  this.detectCoordinates = function (file_path, options){
    options = _.defaults ( options || {}, global_options);
    
    self.geoDetectionService.detectCoordinates ( file_path, function (err, coordinates) {
      if( err) {
        self.fsm.handle( options.repeatEvent, err);
      } else if ( coordinates) {
        self.fsm.handle( options.coordinatesDetectedEvent, coordinates);
      } else {
        self.fsm.handle( options.unknownErrorEvent);
      };
    });
  }

  this.detectCoordinatesByText = function( from_to_text, city_id, options){
    options = _.defaults ( options || {}, global_options);
    self.geoDetectionService.detectCoordinatesByText( from_to_text, city_id, function (err, geocode_data) {
      if( err) {
        self.fsm.handle( options.repeatEvent, err);
      } else if ( geocode_data) {
        self.fsm.handle( options.coordinatesDetectedEvent, geocode_data);
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
