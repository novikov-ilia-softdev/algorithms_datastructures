var idgenerator = require('idgenerator')
var ScriptApplication = require('script_application');
script = new ScriptApplication();

var START_SCRIPT_ATTR = 'StartScript'
var WORKER_FREE_EVENT = 'WorkerFreeEvent'
var WORKER_BUSY_EVENT = 'WorkerBusyEvent'

script.on('run', function () {
	script.controlObject.addStringAttribute( START_SCRIPT_ATTR);
	script.controlObject.onAttributeSet( START_SCRIPT_ATTR, function( attribute){

		script.getRemoteSubject().notify( script.controlObject.name, WORKER_BUSY_EVENT)

		try{
			var attrValue = JSON.parse( attribute.attributeValue)
	    		require(attrValue.scriptPath)(null, attrValue, function(){
				script.getRemoteSubject().notify( script.controlObject.name, WORKER_FREE_EVENT)
			})
		}
		catch( ex){
		    console.log( ex);
		    script.getRemoteSubject().notify( script.controlObject.name, WORKER_FREE_EVENT)
		}

		delete require.cache[attrValue.scriptPath];
	});

	script.getRemoteSubject().notify( script.controlObject.name, WORKER_FREE_EVENT)
});

script.run()