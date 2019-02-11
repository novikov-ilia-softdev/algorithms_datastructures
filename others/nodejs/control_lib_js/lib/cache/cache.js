var wgdb = require("wgdb");
var callbackHelper = require( '../utils/callbackhelper');

module.exports = Cache;

function Cache(){
    var self = this;
    self.db = null;

    self.isInit_ = false;

    self.isInit = function(){
        return self.isInit_;
    };

    self.init = function( conf, callback){
        if( self.isInit_)
            return callbackHelper.callNextTick( callback, "Cache Already inited!", false);

        self.db = new wgdb( conf.name*1, conf.size*1);
        self.db.attach( function( err){
            if( err){
                callbackHelper.callNextTick( callback, err);
                self.destroy();
            }

            callbackHelper.callNextTick( callback, null);
            self.isInit_ = true;
        });
    };

    self.destroy = function(){
        self.db.detach();
        self.db = null;
    };

    self.put = function( key, value, callback){
        self.findRecord( key, function( err, record){
            if( err)
                returncallbackHelper.callNextTick( callback, err);

            if( record == null){
                self.db.createRecord(2, function( err, record){
                    if( err || !record){
                        callbackHelper.callNextTick( callback, err);
                        return;
                    }

                    self.setRecordKeyValue( record, key, value, callback);
                });
            }
            else{
                self.setRecordKeyValue( record, key, value, callback);
            }
        });

    };

    self.get = function( key, callback){
        self.findRecord( key, function( err, record){
            if( err || !record){
                callbackHelper.callNextTick( callback, err);
                return;
            }
            record.getField( 1, function( err, res){
                if( err || !res){
                    callbackHelper.callNextTick( callback, err);
                    return;
                }
                callbackHelper.callNextTick( callback, null, res);
            });
        });
    };

    self.del = function( key, callback){
        self.findRecord( key, function( err, record){
            if( err || !record)
                return callbackHelper.callNextTick( callback, err);

            record.delete(function( err){
                if( err)
                    return callbackHelper.callNextTick( callback, err);
                callbackHelper.callNextTick( callback, null);
            });
        });
    };

    self.findRecord = function( key, callback){
        self.db.findRecord( 0, wgdb.EQUAL, key, function( err, record){
            if( err)
                return callbackHelper.callNextTick( callback, err);
            if( !record)
                return callbackHelper.callNextTick( callback, null, null);

            callbackHelper.callNextTick( callback, null, record);
        });
    };

    self.setRecordKeyValue = function( record, key, value, callback){
        record.setField( 0, key.toString(), function( err){
            if( err)
                callbackHelper.callNextTick( callback, err);
            record.setField( 1, value.toString(), function( err){
                if( err)
                    callbackHelper.callNextTick( callback, err);

                callbackHelper.callNextTick( callback, null, true);
            });
        });
    };
};