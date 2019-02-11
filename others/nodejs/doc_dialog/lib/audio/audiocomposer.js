var audiosprite = require('audiosprite');
var uuid = require('uuid');
var fs = require('fs');
var settings = require('../settings/settings').tts.composer;

module.exports = AudioComposer;

var UNDEFINED_PATH = "";

function AudioComposer(){
    var self = this;

    self.composeFiles = function( fileList, callback){
        
        var opts = { export: settings.format, gap: 0};

        opts.output = settings.path + uuid.v4();

        try
        {
            if( fileList instanceof Array) {

                // console.log("FileList is: " + fileList);
                audiosprite(fileList, opts, function(err, obj) {
                    if( err){
                        callback(err, UNDEFINED_PATH);
                    }
                    if( err instanceof Error) {
                        console.log( err.message);
                        callback(err, UNDEFINED_PATH);
                    }
                    else
                    {
                        fs.stat(settings.path, function( err, stats){
                            if(err)
                                console.log(err);
                            else if( !stats.isDirectory())
                                fs.mkdirSync( settings.path);
                        });
                        // console.log(" Resulting file is: " + opts.output + settings.extension);
                        callback(null, opts.output + settings.extension);
                    }
                });
            }
        }
        catch( err)
        {
            console.log("Exception" + err.message);
            callback(err, UNDEFINED_PATH);
        }
    }
}