module.exports = GeoDetectionService;

var http  = require('http');
var fs = require( 'fs');
var querystring = require('querystring');
var GEO_DETECTION_ERROR = 'geo_detection_error';


function GeoDetectionService( httpWrapper, scenario, settings){
    var self = this;
    self.scenario = scenario;
    
    self.detectCoordinates = function( file, callback, scenario){
        scenario = scenario || self.scenario;
        if( !fs.existsSync( file)){
            callback( GEO_DETECTION_ERROR);
            return;
        }

        var in2 = fs.createReadStream( file);
        
        var params = { content_type: 'audio/x-pcm;bit=16;rate=16000'};
        
        if (scenario){
            params = scenario.addToServiceParams(params);
        }

        var request = {
            host: settings.geo.host,
            port: settings.geo.port,
            path: '/?'+ querystring.stringify(params),
            method: 'POST'
        };

        httpWrapper.send( request, null, in2, function( err, data){
            if( err){
                callback( err);
            }
            else{
                if( data.point){
                    callback( null, data);
                } else {
                    callback( "no point returned", data);
                }
            }
        });
    }

    self.detectCoordinatesByText = function( from_to_text, city_id, callback, scenario){
        scenario = scenario || self.scenario;

        var params = { 
            "from_to": from_to_text,
            "city": city_id
        };
        
        if (scenario)
            params = scenario.addToServiceParams(params);

        var request = {
            host: settings.geo.host,
            port: settings.geo.port,
            path: '/osm?'+ querystring.stringify(params),
            method: 'GET'
        };

        httpWrapper.send( request, null, null, function( err, data){
            if( err){
                callback( err);
            }
            else{
                if( data.from){
                    callback( null, data);
                } else {
                    callback( "no point returned", data);
                }
            }
        });
    }
}

