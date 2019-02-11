const _     = require('underscore');
var conf    = require('../../config');

_.mixin({deepExtend: require("underscore-deep-extend")(_)});
 
try {
  var override = require('../../config.override');
  conf = _.deepExtend(conf, override);
} catch (error) {
  switch (error.code)
  {
    case 'MODULE_NOT_FOUND': break; //ignore
    default: 
     throw (error);
  }
};

module.exports=conf;