module.exports = RoutingTableManager;
var timeSettings = require( '../timesettings/timesettings');

var spawn = require( 'child_process').spawn;
var rangeCheck = require('range_check');

function RoutingTableManager(){
	var _self = this;
	_self.routingTable = [];
	
	// +
	_self.init = function( callback){
		_self.routingTableMonitoring( callback);
		setInterval( _self.routingTableMonitoring, timeSettings.routingTableMonitorIntervalMs);
	};
	
	// -
	_self.routingTableMonitoring = function( callback){
		var route = spawn( 'route', ['-n']);
		route.stdout.setEncoding( 'utf8');
		route.stdout.on( 'data', function ( data){
			_self.routingTable = _self.dispatchData( data);
			if( callback)
				callback();
		});

		route.stderr.on( 'data', function ( error){
			_self.routingTable = [];
		});
	};
	
	// +
	_self.getRoutingTable = function( callback){
		return _self.routingTable;
	};
	
	// -
	_self.dispatchData = function( data) {
		var rawRoutes = data;
		var routesList = [];
		var rawRoutesList = rawRoutes.split( "\n");
		rawRoutesList.splice( rawRoutesList.length - 1, 1);
		for( var i = 0; i < rawRoutesList.length; i++) {
			rawRoute = rawRoutesList[i];
			var route = _self.parseRoute( rawRoute);
			if( rangeCheck.validIp( route.dest))
				routesList.push( route);
		}
		return routesList;
	}

	// -
	_self.parseRoute = function( rawRoute) {		
		var route = {};
		route.dest = rawRoute.match( /(\S+)/ig)[0];
		route.gw = rawRoute.match( /(\S+)/ig)[1];
		route.mask = rawRoute.match( /(\S+)/ig)[2];
		route.flags = rawRoute.match( /(\S+)/ig)[3];
		route.metric = rawRoute.match( /(\S+)/ig)[4];
		route.ref = rawRoute.match( /(\S+)/ig)[5];
		route.use = rawRoute.match( /(\S+)/ig)[6];
		route.iface = rawRoute.match( /(\S+)/ig)[7];
		return route;
	};
}