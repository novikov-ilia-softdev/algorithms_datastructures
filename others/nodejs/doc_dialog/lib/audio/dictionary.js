module.exports = Dictionary;

var path = require('path');

var settings = require('../settings/settings').tts.db;
var AudioFilesMap = require('./audiofilesmap');


function Dictionary(){

    var self = this;

    self.audioFilesMap = new AudioFilesMap();

    self.init = function( callback) {
        self.audioFilesMap.loadDatabase( settings.path+'/'+settings.name, function( error) {
            if( callback instanceof Function) {
                callback( error);
            }
        });
    };

    self.getFile = function( id, callback){
        var filePath = self.audioFilesMap.getAudioFilePath( id);

        if( filePath == null)
            callback("Undefined path", null);
        else
            callback(null, filePath);
    };

    self.getFileList = function( idList, callback){
        var list = [];

        try{
            if( idList.length != 0)
            {
                for(var i = 0; i < idList.length; i++)
                {
                    var filePath = self.audioFilesMap.getAudioFilePath( idList[i]);
                    if( !filePath)
                        throw new Error("ID invalid");

                    list.push( filePath);
                }
            }
            if( list.length == 0)
                callback("Id list is empty!!!!", list);
            else
                callback(null, list);

        }
        catch(err)
        {
            callback(err, list);
        }
    };
}