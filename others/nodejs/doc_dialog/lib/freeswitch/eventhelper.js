module.exports = EventHelper;

function EventHelper(){
    var self = this;

    self.isStartSpeechEvent = function( event){
        return (event.subclass == 'start_speech');
    };

    self.isStopSpeechEvent = function( event){
        return (event.subclass == 'stop_speech');
    };

    self.isUserSaidEvent = function( event){
        return (event.subclass == 'user_said');
    };

    self.getUserSaidFilePathEvent = function( event){
        for( var i in event.headers)
        {
            if( event.headers[ i].name == 'file_path'){
                return event.headers[ i].value;
            }
        }

        return null;
    };

    self.isDTMFEvent = function( event){
        return ( event.type == 'DTMF');
    };

    self.getDTMFDigit = function( event){
        for( var i in event.headers)
        {
            if( event.headers[ i].name == 'DTMF-Digit'){
                return event.headers[ i].value;
            }
        }

        return null;
    };

    self.getGatewayOnConnection = function( event){
        var defaultGateway = 'external::example.com';
        if( !event)
            return defaultGateway;

        for( var i in event.headers)
        {
            if( event.headers[ i].name == 'variable_sip_gateway'){
                return event.headers[ i].value;
            }
        }

        return defaultGateway;
    };

    self.isDTMFForClient = function( event, clientId){
        if( event.type == 'DTMF'){
            for( var i in event.headers){
                if( event.headers[ i].name == 'Unique-ID'){
                    return ( event.headers[ i].value == clientId)
                }
            }
        }
    };

    self.isStartSpeechEventForClient = function( event, clientId){
        if( event.subclass == 'start_speech'){
            for( var i in event.headers){
                if( event.headers[ i].name == 'Unique-ID'){
                    return ( event.headers[ i].value == clientId)
                }
            }
        }
    };

    self.isUserSaidEventForClient = function( event, clientId){
        if( event.subclass == 'user_said'){
            for( var i in event.headers){
                if( event.headers[ i].name == 'Unique-ID'){
                    return ( event.headers[ i].value == clientId)
                }
            }
        }
    };
}
