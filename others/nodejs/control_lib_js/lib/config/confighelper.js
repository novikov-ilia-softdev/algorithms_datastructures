var stringHelper = require( '../utils/stringhelper.js');

var configHelper = exports = module.exports = {};

var PATH_PREFIX = '/platform/control/';
var NAME_PREFIX = 'platform.control.';
var SUBJECT_NAME = 'Subject_0';

var config = require( "../../config.json");

var entitiesMap = {};

for( var i in config.static){
	entitiesMap[ config.static[ i].entity] = config.static[ i][config.transport];
	entitiesMap[ config.static[ i].entity].transport = config.transport;
}

var dynamicSettings = config.dynamic[config.transport];

configHelper.createPath = function( name){
	return PATH_PREFIX + name;
};

configHelper.createPath = function( name){
	return PATH_PREFIX + name;
};

configHelper.createName = function( name){
	return NAME_PREFIX + name;
};

configHelper.getSubjectName = function(){
	return SUBJECT_NAME;
};

configHelper.createControlObjectName = function( objectType, objectId){
	return objectType + "_" + objectId;
};

configHelper.getControlObjectIdFromControlObjectName = function( objectName){
	var objectNameAsArray = stringHelper.explode('_', objectName);
	var objectId = objectNameAsArray[1];
	return objectId;
};

configHelper.getControlObjectTypeFromControlObjectName = function( objectName){
	var objectNameAsArray = stringHelper.explode('_', objectName);
	var objectType = objectNameAsArray[0];
	return objectType;
};

configHelper.getConfByName = function( objectName){
    var result = null;
    if( entitiesMap[ objectName])
        result = entitiesMap[ objectName];

    return result;
};

configHelper.getAnyConfByName = function( objectName){
    var result = configHelper.getConfByName();
    if( !result)
        result = configHelper.getDynamicConf( objectName);
    return result;
};

configHelper.getDynamicConf = function( name){
	var newDynamicConfig = {};
	newDynamicConfig.transport = config.transport;
	newDynamicConfig.path = dynamicSettings.path+"/"+name+".sock";

    return newDynamicConfig;
};

configHelper.getSubject = function( ){
    var result = null;

	if( entitiesMap[ SUBJECT_NAME])
        result = entitiesMap[ SUBJECT_NAME]

	return result;
};

configHelper.getCacheConf = function(){
	return config.cache;
};

configHelper.getLogConf = function(){
	return config.log;
};

configHelper.getPresenceConf = function(){
	return config.presence;
};