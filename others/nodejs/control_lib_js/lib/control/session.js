var RemoteObject = require('./remoteobject');
var RemoteSubject = require('./remotesubject');
var ControlObject = require('./controlobject');
var configHelper = require( '../config/confighelper');

var session = exports = module.exports = {};
var isStarted = false;

session.controlObjectList = {};

session.start = function(){
	controlObjectList = {};
	isStarted = true;
};

session.stop = function(){
	for( var i in session.controlObjectList)
		session.controlObjectList[i].destroy();

	session.controlObjectList = {};
	isStarted = false;
};

session.isStarted = function(){
	return isStarted;
};

session.getRemoteObject = function( name, controlObject){
	return new RemoteObject( name, controlObject);
};

session.getRemoteSubject = function( controlObject){
	return new RemoteSubject( this, controlObject);
};

session.getControlObject = function( objectType, objectId){
	var controlObjectName = "";
	if( objectId == null)
		controlObjectName = objectType;
	else
		controlObjectName = configHelper.createControlObjectName( objectType, objectId);

	if( session.controlObjectList[controlObjectName] != null)
		return session.controlObjectList[controlObjectName];
	return null;
};

session.createControlObject = function( objectType, objectId){

	if( objectId == null){
		objectId = configHelper.getControlObjectIdFromControlObjectName( objectType);
		objectType = configHelper.getControlObjectTypeFromControlObjectName( objectType);
	}

	var controlObject = new ControlObject( objectType, objectId);
	session.controlObjectList[ controlObject.name] = controlObject;
	return controlObject;
};
