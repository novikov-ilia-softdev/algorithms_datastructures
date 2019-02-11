module.exports = {}

module.exports.show = function( script, settings){

	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrTimeStep.name, function (err, res) {
		if( !err){
			var lineEdit = script.widgetManager.createLineEdit( 'Время ответа(с)', res);

			lineEdit.getInput(function (value) {
				script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrTimeStep.name, value, function (err, res) {
					err ?
						script.widgetManager.createInformationDialog( 'Ошибка', 'Не удалось применить настройку').show() :
						script.widgetManager.createInformationDialog( 'Уведомление', 'Настройка применена').show()
				});
			});

			lineEdit.show()
		}
	});
};