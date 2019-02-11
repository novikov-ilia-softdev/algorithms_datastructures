module.exports = SpeechRecognitionService;

var http  = require('http');
var fs = require( 'fs');
var querystring = require('querystring');
var SPEECH_RECOGNITION_ERROR = 'speech_recognition_error';
var FILE_NOT_EXIST_ERROR = 'file_not_exist';


function SpeechRecognitionService( httpWrapper, scenario, settings){
    var self = this;

    self.detectName = function( file, callback){
        if( !fs.existsSync( file)){
            callback( FILE_NOT_EXIST_ERROR, file);
            return;
        }

        var in2 = fs.createReadStream( file);
        var params = {content_type: 'audio/x-pcm;bit=16;rate=16000'};
        
        if (scenario){
            params = scenario.addToServiceParams(params);
        }

        var request = {
            host: settings.speech.host,
            port: settings.speech.port,
            path: '/name?' + querystring.stringify(params),
            method: 'POST'
        };

        httpWrapper.send( request, null, in2, function( err, data){
            if( err){
                callback( err);
            }
            else{
                if( data.code == 1){
                    callback( null, data.name);
                }
                else{
                    //if(data.recognize.success){
                    //    callback( null, self._getBestVariant( data.recognize.variants));
                    //}
                    //else{
                        callback( SPEECH_RECOGNITION_ERROR);
                    //}
                }
            }
        });
    }

    self._getBestVariant = function( variants){
        var bestVariant = 0;

        for( var i = 0; i < variants.length; i++){
            if( variants[i].confidence > variants[ bestVariant].confidence)
                bestVariant = i;
        }

        return variants[ bestVariant].text;
    }

    self.detectAgreement = function( file, callback){
        if( !fs.existsSync( file)){
            callback( FILE_NOT_EXIST_ERROR, callback);
            return;
        }

        var in2 = fs.createReadStream( file);
        
         params = {content_type: 'audio/x-pcm;bit=16;rate=8000',
                   topic:"queries"
                   };
        
        if (scenario){
            params = scenario.addToServiceParams(params);
        }

        var request = {
            host: settings.speech.host,
            port: settings.speech.port,
            path: '/yesno?' + querystring.stringify(params),
            method: 'POST'
        };

        httpWrapper.send( request, null, in2, function( err, data){
            if( err){
                callback( err);
            }
            else{
                if( data.code == 1){
                    callback( null, true);
                    return;
                }

                if( data.code == 0){
                    callback( null, false);
                    return;
                }

                callback( SPEECH_RECOGNITION_ERROR);
            }
        });
    }

    self.simpleRecognize = function (file, callback){
        if( !fs.existsSync( file))
            return callback( FILE_NOT_EXIST_ERROR);

        var in2 = fs.createReadStream( file);
        
         params = { content_type: 'audio/x-pcm;bit=16;rate=8000'
                  , engine:"google"
                  };
        
        if (scenario){
            params = scenario.addToServiceParams(params);
        }

        var request = {
            host: settings.speech.host,
            port: settings.speech.port,
            path: '/?' + querystring.stringify(params),
            method: 'POST'
        };

        httpWrapper.send( request, null, in2, callback);
    }
}
