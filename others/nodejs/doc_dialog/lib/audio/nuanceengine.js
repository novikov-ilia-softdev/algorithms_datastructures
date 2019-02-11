var uuid = require('uuid');
var https = require( 'https');
var fs = require('fs');
var phraseCompleter = require( './phrasecompleter');
var MapStore = require( '../mapstore');

module.exports = NuanceEngine;

function NuanceEngine( scenario, settings){
    var self = this;

    self.settings = settings;
    self.phraseList = require( settings.phraseListFile);

    self.cacheEnabled = settings.cache.enabled;

    self.hostname = settings.engine_config.hostname;
    self.port = settings.engine_config.port;
    self.url = settings.engine_config.url;
    self.appId = settings.engine_config.appId;
    self.appKey = settings.engine_config.appKey;
    self.ttsLang = settings.engine_config.ttsLang;
    self.id = settings.engine_config.id;
    self.voice = settings.engine_config.voice;
    self.path = settings.path;
    self.extension = settings.extension;
    self.cache_file = settings.cache.file;

    if( !fs.existsSync(self.path))
        fs.mkdirSync( self.path);

    self.phraseFilesCache = new MapStore();

    self.init = function( callback) {
        if( !fs.existsSync( self.cache_file)){
            fs.writeFileSync( self.cache_file, '');
            var fd = fs.openSync( self.cache_file, "w+");
            fs.fchmodSync( fd, "777");
        }

        self.phraseFilesCache.load( self.cache_file, function( error) {
            if( callback instanceof Function) {
                callback( error);
            }
        });
    };

    self.getFile = function( phraseId, data, callback){

        if( !self.phraseList.hasOwnProperty( phraseId)){
            process.nextTick( ()=>{
                callback( "Phrase not found: "+phraseId);
            });
            return;
        }
        var phrase = self.phraseList[phraseId].tts;

        phrase = phraseCompleter.completeShort( phrase, data);
        scenario.ttsEngine( "Get tts file Nuance for phrase: "+phrase);
        self.loadFileForPhrase( phrase, callback);
    }

    self.createCacheKey = function( phrase){
        return self.settings.engine+"."+self.voice+"."+phrase;
    }

    self.loadFileForPhrase = function( phrase, callback){

        if( self.cacheEnabled){
            var cacheFilePath = self.phraseFilesCache.get( self.createCacheKey(phrase));
            if( cacheFilePath){
                if( fs.existsSync( cacheFilePath)){
                    scenario.ttsEngine( "Load file from cache: " + cacheFilePath);
                    process.nextTick( ()=>{
                        callback( null, cacheFilePath);
                    });
                    return;
                }
            }
        }

        var options = {
            method: 'POST',
            hostname: self.hostname,
            port: self.port,
            path: self.url+"?appId="+self.appId+"&appKey="+self.appKey+"&ttsLang="+self.ttsLang+"&id="+self.id+"&voice="+self.voice,
            headers: { "Content-Type": "text/plain; charset=utf-8", "Accept": "audio/x-wav" }
        };

        var fname = uuid.v4() + self.extension;
        var filePath = self.path + fname;

        var file = fs.createWriteStream( filePath );
        scenario.ttsEngine( "Download tts file Nuance for phrase: "+phrase);
        var req = https.request(options, (response) => {
            response.pipe(file);
            scenario.ttsEngine( "Download tts file Nuance for statusCode: "+response.statusCode);
            if( response.statusCode != 200)
            {
                process.nextTick( ()=>{
                    callback( "Error download file: "+response.statusCode);
                });
                return;
            }

            response.on('end', () => {
                if( self.cacheEnabled)
                    self.phraseFilesCache.set( self.createCacheKey(phrase), filePath);
                callback( null, filePath);
            });
        });
        req.on('error', (e) => {
            process.nextTick( ()=>{
                callback( "Error download file: "+e);
            });
        });
        req.write( phrase);
        req.end();
    }
}