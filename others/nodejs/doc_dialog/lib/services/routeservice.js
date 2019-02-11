module.exports = RouteService;

function RouteService( httpWrapper, scenario, settings){
    var self = this;

    self.getRouteInfo = function( location, destination, callback){
        //console.log("RouteService got route info!!!!");
        callback( null,"routeInfo");
    }

    self.getPublicTransportInfo = function( location, destination, callback){
        //console.log("RouteService got public transport info!!!!");
        callback( null,"PublicTransportInfo");
    }
}

