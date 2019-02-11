var conf = require( '../settings/settings').doctor_settings;

module.exports.getDefault = function (){
  return conf.default;
}