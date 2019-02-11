const _  = require('underscore');

function activateEvents (callConnection, fsm)
{
  var events = [];

  events.push([ 'CallEndedEvent',      'CallEnded']);
  events.push([ 'dtmf', 'dtmf']);
  events.push([ 'PickedUpEvent', 'PickedUp']); //when user pickup phone after our call
  events.push([ 'BridgeAnswered', 'BridgeAnswered']);
  events.push([ 'BridgeEnded', 'BridgeEnded']);
  
  //making functions
  listeners = _.map (events, function(event) {
     return {
       name: event[0],
       func: function (e){ fsm.handle (event[1], e);}
     }
  });

  //add listeners
  _.each( listeners, function ( listener) {
    callConnection.addListener (listener.name, listener.func);
  });

  callConnection.activateEvents();
  
  return listeners;
}

function deactivateEvents (callConnection , listeners)
{
  _.each( listeners, function ( listener) {
    callConnection.removeListener (listener.name, listener.func);
  })
  callConnection.deactivateEvents();
}

function clearEvents (callConnection)
{
  callConnection.removeAllListeners ();
}


module.exports = {};

module.exports.activate   = activateEvents;
module.exports.deactivate = deactivateEvents;
module.exports.clear      = clearEvents;