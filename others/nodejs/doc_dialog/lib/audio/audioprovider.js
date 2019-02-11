var IdConverter = require('./idconverter');
var Dictionary = require('./dictionary');
var AudioComposer = require('./audiocomposer');

module.exports = AudioProvider;

require ('./fileidsmixins').extend(AudioProvider.prototype);

function AudioProvider(scenario, settings){

    var self = this;

    self.idConverter = new IdConverter();
    self.idConverter.init();
    self.dictionary = new Dictionary();
    self.audioComposer = new AudioComposer();
    
    self.inited = false;

    self.AUDIO_PROVIDER_ERROR_PREFIX = "AudioProvider";
    self.settings = settings.tts;

    if( self.settings.engine == "nuance"){
        var NuanceEngine = require('./nuanceengine');
        self.engine = new NuanceEngine( scenario, self.settings);
    }

    if( self.settings.engine == "crt"){
        var CrtEngine = require('./crtengine');
        self.engine = new CrtEngine( scenario, self.settings);
    }

    self.init = function( callback) {
        var callbackWrap =  function(error) {
            self.inited = !error;
            callback(error);
        };
        if( self.settings.engine == "plain"){
            self.dictionary.init( callbackWrap);
        }else{
            self.engine.init( callbackWrap)
        }
    };

    self.getFile = function( phraseId, data, callback){
        if( !self.inited) {
            callback("AudioProvider is not inited!");
            return;
        }

        if( self.settings.engine != "plain")
            self.engine.getFile( phraseId, data, callback);
        else{
            self.idConverter.getIdList( phraseId, data, function( err, idList){
                if( err){
                    scenario.audioProvider("IdConverter error ", err);
                    callback( err);
                }
                else {
                    if( idList instanceof Array) {
                        if( idList.length == 1) {
                            self.dictionary.getFile( idList[0], function(err, filePath){
                                if( err) {
                                    scenario.audioProvider("Dictionary error ", err);
                                    callback( err);
                                }
                                else {
                                    scenario.audioProvider("Dictionary return path " + filePath);
                                    callback( null, filePath);
                                }
                            });

                        }
                        else if( idList.length > 1) {
                            self.dictionary.getFileList( idList, function(err, fileList){
                                if( err) {
                                    scenario.audioProvider("Dictionary error ", err);
                                    callback( err);
                                }
                                else {
                                    scenario.audioProvider("Dictionary return list " + fileList.join(', '));
                                    self.audioComposer.composeFiles( fileList, function(err, filePath){
                                        if( err) {
                                            scenario.audioProvider("AudioComposer error ", err);
                                            callback( err);
                                        }
                                        else {
                                            scenario.audioProvider("AudioComposer return path "+filePath);
                                            callback( null, filePath);
                                        }
                                    });

                                }
                            });
                        }
                        else {
                            scenario.audioProvider("AUDIO_PROVIDER Error!!!! ", err || "idList.length <= 0");
                            callback( err);
                        }
                    }
                    else
                        callback( err);
                }
            });
        }

    }
}

