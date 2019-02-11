var ScriptApplication = require('script_application');

var script;

var start = module.exports = function (fakeScriptApplication) {
	if (fakeScriptApplication) {
		script = fakeScriptApplication;
	} else {
		script = new ScriptApplication();
	}

	script.on('run', function () {
		script.init( function(){
			script.getInfo( function(){
				require( './src/menu/main/menu').show( script)
			});
		})
	});

	script.init = function (callback) {
		script.attributes = require('./src/attribute/attributes');
		script.widgetManager = script.createWidgetManager( callback)
	};

	script.getInfo = function(callback){
		callback()
	};

	script.on('run_error', function (err) {});

	script.on('stop', function (code) {});

	script.exitScript = function () {
		script.getRemoteSubject().unsubscribe(script.controlObject.name, function (err, res) {
			if (err != null)
				script.getLogger().logError("Не удалось отрегистрироваться на получение уведомлений.", function () {
					script.getLogger().logMessage("Скрипт завершен.", script.stop);
				});
			else
				script.getLogger().logMessage("Отрегистрировался на получение уведомлений.", function () {
					script.getLogger().logMessage("Скрипт завершен.", script.stop);
				});
		});
	};

	script.run();
};

if (!module.parent) {
	start();
}