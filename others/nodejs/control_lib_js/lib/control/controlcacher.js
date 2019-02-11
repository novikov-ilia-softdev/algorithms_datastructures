var Cache = require( '../cache/cache');
var configHelper = require( '../config/confighelper');
var callbackHelper = require( '../utils/callbackhelper');

module.exports = ControlCacher;

function ControlCacher(){
    var self = this;
    self.isInit_ = false;
    self.cache = null;
    self.enabled = false;

    self.isInit = function(){
        return self.isInit_;
    };

    self.buildKey = function( name, key){
        return name + "_" + key;
    };

    self.init = function( conf, callback){
        if( callbackHelper.isFunction( conf))
            callback = conf;
        if( self.isInit_)
            return callbackHelper.callNextTick( callback, "ControlCacher Already inited!", false);

        self.cache = new Cache();


        var cacheConf = conf;
        if( callbackHelper.isFunction( cacheConf))
            cacheConf = configHelper.getCacheConf();

        if( cacheConf.enable == "yes")
            self.enabled = true;

        self.cache.init( cacheConf, function( err, res){
            if( !err)
                self.isInit_ = true;
            callbackHelper.callNextTick( callback, err, res);
        });
    };

    self.getCachedAttribute = function( controlObjectName, attributeName, callback){
        var key = self.buildKey( controlObjectName, attributeName);
        if( self.enabled)
            self.cache.get( key, callback);
        else
            callbackHelper.callNextTick( callback, null, null);
    };

    self.delCachedAttribute = function( controlObjectName, attributeName, callback){
        var key = self.buildKey( controlObjectName, attributeName);
        if( self.enabled)
            self.cache.del( key, callback);
        else
            callbackHelper.callNextTick( callback, null, null);
    };

    self.cacheAttribute = function( controlObjectName, attributeName, attributeValue, callback){
        var key = self.buildKey( controlObjectName, attributeName);
        if( self.enabled)
            self.cache.put( key, attributeValue,  callback);
        else
            callbackHelper.callNextTick( callback, null, null);
    };

    self.destroy = function(){
        self.cache.destroy();
    };
}