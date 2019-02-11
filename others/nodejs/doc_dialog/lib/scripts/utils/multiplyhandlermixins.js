const _  = require('underscore');

/**
 * mixin functions for scripts
 * 
 * script must have properties:
 *  
 * fsm                  - machina.Fsm  
 */

function MultiplyHandler (script)
{
  var events = [];
  var self = this;
  self.reset = function ()
  {
    events = [];
  }

  self.add = function (event_name, event_params)
  {
    events.push({
      order: events.length,
      name:event_name,
      params: event_params
    })

    if (events.length > 1){
      self.trigger();
    }
  }

  self.trigger = function ()
  {
    var tr_events = _.sortBy(events, 'name'); 
    script.fsm.handle( _.pluck(tr_events,'name').join('..'), tr_events);
  }
  return self;
}


var mixins = function (global_options) {
  var self = this;
  global_options = global_options || {};  
  
  self.multiplyHandler = new MultiplyHandler(self);
}

module.exports = {};

module.exports.extend = function (dest, options) {
  mixins.call(dest, options);
}
