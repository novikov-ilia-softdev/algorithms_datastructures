var module = this;

var FS_Server       = require( './lib/freeswitch/fsserver');
var logger          = require( './lib/log/logger');
var scenarioManager = require( './lib/scenario/scenariomanager');
var ScriptManager   = require( './lib/scripts/scriptmanager');
var ScriptLauncher  = require( './lib/scripts/scriptlauncher');
var settings        = require( './lib/settings/settings');
var ServiceManager  = require( './lib/services/servicemanager');
var ApiServer = require( './lib/api/apiserver');

module.logger = logger;

module.fsServer = new FS_Server( module, settings);
module.scriptManager = new ScriptManager( module);
module.clientManager = ServiceManager.getClientManager();
module.scriptLauncher = new ScriptLauncher( module);
module.scenarioManager = scenarioManager;
module.apiServer = new ApiServer(module, settings.api);

module.fsServer.run();

module.fsServer.on( 'incoming_call', function( conn, id, scenario_id){
    module.scriptManager.handleIncomingCall( conn, id, scenario_id);
});

module.fsServer.on( 'play_file_finished', function( id, err, filePath){
    module.scriptLauncher.notifyScript( id, 'play_file_finished', {err:err, filePath:filePath});
});

module.fsServer.on( 'user_said', function( id, err, originalFilePath, rate16000FilePath, amrFilePath){
    module.scriptLauncher.notifyScript( id, 'user_said', {err:err, originalFilePath:originalFilePath, rate16000FilePath:rate16000FilePath, amrFilePath: amrFilePath});
});

module.fsServer.on( 'call_ended', function( id){
    module.scriptLauncher.notifyScript( id, 'call_ended');
});

module.fsServer.on( 'picked_up', function( id){
    module.scriptLauncher.notifyScript( id, 'picked_up');
});

module.fsServer.on( 'bridge_answered', function( id){
    module.scriptLauncher.notifyScript( id, 'bridge_answered');
});

module.fsServer.on( 'bridge_ended', function( id){
    module.scriptLauncher.notifyScript( id, 'bridge_ended');
});

module.fsServer.on( 'dtmf', function( id, err, digit){
    module.scriptLauncher.notifyScript( id, 'dtmf', { err: err, digit: digit});
});

module.fsServer.on( 'city_info', function( id, city_info){
    module.scriptLauncher.notifyScript( id, 'city_info', { city_info : city_info});
});

module.scriptLauncher.on( 'commandFromScript', function( command, id){
    module.fsServer.handleCommandFromScript( command, id);
});

module.apiServer.run();