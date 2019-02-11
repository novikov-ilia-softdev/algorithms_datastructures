module.exports = HTTPWrapper;

var http  = require( 'http');
var fs    = require( 'fs');
var path  = require( 'path');
var querystring = require('querystring');

function HTTPWrapper( settings){
    var self = this;
    var LOG_FILE = path.format({
                            dir: settings.dir,
                            base: settings.file
                        }); 

    self.send = function( request, params, readStream, callback){
        fs.appendFileSync( LOG_FILE, new Date() + ': send' + JSON.stringify( arguments) + '\n');

        var req = http.request ( request, function( res){
            var answer = "";

            res.on( 'data', function( data){
                answer += data.toString();
            });

            res.on( 'end', function(){
                var error = (res.statusCode == 200) ? null : res.statusCode;
                try{
                    var dataObj = JSON.parse( answer);
                    self._finishSend( error, dataObj, callback);
                }
                catch( ex){
                    if (error) self._finishSend( error, answer, callback);
                    else self._finishSend( ex.toString(), answer, callback);
                }
            })
        });

        req.on( 'error', function( err){
            self._finishSend( err, null, callback);
            return;
        });

        if( params)
            req.write( querystring.stringify( params));

        if( readStream)
            readStream.pipe( req);
        else
            req.end();
    };

    self._finishSend = function( err, data, callback){
        fs.appendFileSync( LOG_FILE, new Date() + ': _finishSend' + JSON.stringify( arguments) + '\n\n');
        if (callback) 
            err ? callback( err, data) : callback( null, data);
    }
}
