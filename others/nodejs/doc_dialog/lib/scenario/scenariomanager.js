const _       = require('underscore');
const uuid    = require('uuid');
const Smodule = require('./scenario');

var ScenarioFabric = {
  _scenaries: {},
  
  register: function (params){
    var path ="";
    var id = "";
    params = params || {};
    if (_.has(params, "scenario"))
    {
      id = params.scenario;
      path = ".";
    }
    else 
    {
      id = uuid.v4();
    }
      
    if (_.has(params, "scenario_path"))
    {
      path = params.scenario_path + ".";
    }
    
    if ( ! _.has(this._scenaries, id)) this._scenaries[id] = path;
    return new Smodule.Scenario(id, path);
  },
  
  get : function (id){
    if ( _.has(this._scenaries, id))
    {
      return new Smodule.Scenario( id, this._scenaries[id]);
    }
    else
    {
      return this.register({scenario: id});
    }
  },
  
  parse: function (str){
    return this.register(Smodule.ScenarioParamsFromString(str));
  },
  
  toString: function (id){
    var s = this.get(id);
    return s.toString();
  }
}

module.exports = ScenarioFabric;