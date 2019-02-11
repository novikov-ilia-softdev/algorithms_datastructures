var uuid = require('uuid');
var https = require( 'https');
var fs = require('fs');
var phraseCompleter = require( './phrasecompleter');
var MapStore = require( '../mapstore');
var child_process = require('child_process');

module.exports = CrtEngine;

function CrtEngine( scenario, settings){
    var self = this;

    self.settings = settings;
    self.phraseList = require( settings.phraseListFile);

    self.cacheEnabled = settings.cache.enabled;

    self.hostname = settings.engine_config.hostname;
    self.url = settings.engine_config.url;
    self.apikey = settings.engine_config.apikey;
    self.ttsVoice = settings.engine_config.ttsVoice;
    self.textFormat = settings.engine_config.textFormat;

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

        phrase = phraseCompleter.complete( phrase, data);
        scenario.ttsEngine( "Get tts file Crt for phrase: "+phrase);
        self.loadFileForPhrase( phrase, callback);
    }

    self.createCacheKey = function( phrase){
        return self.settings.engine+"."+self.ttsVoice+"."+phrase;
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
            method: 'GET',
            rejectUnauthorized: false,
            hostname: self.hostname,
            path: encodeURI( self.url+"?apikey="+self.apikey+"&ttsVoice="+self.ttsVoice+"&textFormat="+self.textFormat+"&text="+phrase),
            headers: { "Content-Type": "text/plain; charset=utf-8", "Accept": "audio/x-wav" }
        };

        var fname = uuid.v4();

        var filePathRaw = self.path + fname+".raw";
        var filePath = self.path + fname+ self.extension;

        var file = fs.createWriteStream( filePathRaw );
        scenario.ttsEngine( "Download tts file Crt for phrase: "+phrase);
        var req = https.request(options, (response) => {
            response.pipe(file);
            scenario.ttsEngine( "Download tts file Crt for statusCode: "+response.statusCode);
            if( response.statusCode != 200)
            {
                process.nextTick( ()=>{
                    callback( "Error download file: "+response.statusCode);
                });
                return;
            }

            response.on('end', () => {
                var command = "sox -r 22050 -e signed -b 16 " + filePathRaw + " " + filePath;
                child_process.exec( command, function( err, stdout, stderr){
                    if( !err){
                        if( self.cacheEnabled)
                            self.phraseFilesCache.set( self.createCacheKey(phrase), filePath);
                        callback( null, filePath);
                    }
                    else
                        callback( err);
                });

            });
        });
        req.on('error', (e) => {
            process.nextTick( ()=>{
                scenario.ttsEngine( "Error download file: "+e);
                callback( "Error download file: "+e);
            });
        });
        req.end();
    }
}