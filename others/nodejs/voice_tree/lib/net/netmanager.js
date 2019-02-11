var EventEmitter = require( "events").EventEmitter;
var util = require( "util");
var RoutingTableManager = require( './routingtablemanager');
var dgram = require("dgram");
var events = require( '../event/events');
var timeSettings = require( '../timesettings/timesettings');

module.exports = NetManager;
util.inherits( NetManager, EventEmitter);

var SOCKET_PORT = 35107;
var BROADCAST_SOCKET_PORT = 35108;
//var FIRST_BROADCAST_ADDRESS = "192.168.1.255";
//var SECOND_BROADCAST_ADDRESS = "192.168.2.255";

function NetManager( module){
	var _self = this;
	_self.module = module;
	_self.isInit = false;
	_self.selfAddresses = [];
	_self.routingTableManager = new RoutingTableManager();
	_self.broadcast_socket = null;
	_self.socket = null;
	
	// +
	_self.init = function( callback){
		_self.getSelfInfo( function(){
			_self.createSocket( function(){
				_self.createBroadcastSocket( function(){
					_self.routingTableManager.init( function(){
						_self.module.logger.logMessage( "NetManager inited");
						_self.isInit = true;
						callback();
					});
				})
			})
		});
	}
	
	// -
	_self.getSelfInfo = function( callback){
		var ROUTING_INTERFACE_ATTR_NAME = "Interface";
		_self.module.getRemoteObjectHelper().getAttr( _self.module.getRemoteObject( _self.module.getControlObjectNames().routing), ROUTING_INTERFACE_ATTR_NAME, function( err, res){
			if( err){
				_self.module.logger.logMessage( "error get interface! trying once more...");
				setTimeout( function(){
					_self.getSelfInfo( callback);
				}, 3000);
				return;
			}
			
			_self.module.logger.logMessage( "ok get interface.");
			
			var interfaceList;
			
			try{
				interfaceList = JSON.parse( res);
			}
			catch( err){
				_self.module.logger.logMessage( "error parsing inteface list");
				return;
			}
			
			var wlanFound = false;
			
			for( var i in interfaceList){
				if( interfaceList[ i].name.indexOf( "wlan") != -1){
					_self.selfAddresses.push( interfaceList[ i].address);
					_self.module.logger.logMessage( "selfAddress is " + interfaceList[ i].address);
					wlanFound = true;
				}
			}
			
			if( !wlanFound){
				setTimeout( function(){
					_self.getSelfInfo( callback)
					
				}, timeSettings.netManagerReinitTimeoutMs)
			}
			else
				callback();
		});
	}
	
	// -
	_self.createSocket = function( callback){
		_self.socket = dgram.createSocket( "udp4");
		
		_self.socket.on( "listening", function(){
			callback();
		});
		
		_self.socket.on( "message", function (msg, rinfo){
			_self.emit( events.waveMessage.name, msg, rinfo);
		});
		
		_self.socket.on( "error", function( err){
			_self.socket.close();
		});
		
		_self.socket.bind( SOCKET_PORT);
	}
	
	// -
	_self.createBroadcastSocket = function( callback){
		_self.broadcast_socket = dgram.createSocket( "udp4");
	
		_self.broadcast_socket.on( "listening", function(){
			_self.broadcast_socket.setBroadcast( true);
			callback();
		});
		
		_self.broadcast_socket.on( "message", function (msg, rinfo){
			_self.emit( events.nodeStatusMessage.name, msg, rinfo);
		});
		
		_self.broadcast_socket.on( "error", function( err){
			_self.broadcast_socket.close();
		});
		
		_self.broadcast_socket.bind( BROADCAST_SOCKET_PORT);
	}
	
	// +
	_self.broadcastSend = function( string){
		var message = new Buffer( string);
		for( var i in _self.selfAddresses){
			var address = _self.selfAddresses[ i];
			var lastByte = address.substr( address.lastIndexOf( "."));
			var broadcastAddress = address.replace( lastByte, ".255");
			_self.broadcast_socket.send( message, 0, message.length, BROADCAST_SOCKET_PORT, broadcastAddress);
		}
	}
	
	// +
	_self.sendMessage = function( address, string){
		var message = new Buffer( string);
		_self.socket.send( message, 0, message.length, SOCKET_PORT, address);
	}
	
	// +
	_self.getSelfAddresses = function(){
		return _self.selfAddresses;
	}
	
	// +
	_self.getRoutingTable = function(){
		return _self.routingTableManager.getRoutingTable();
	}
}