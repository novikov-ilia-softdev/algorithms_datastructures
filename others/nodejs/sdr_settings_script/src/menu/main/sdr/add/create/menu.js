module.exports = {}

module.exports.show = function( script, settings){
	var lineEdit = script.widgetManager.createLineEdit( settings.title + '(имя)');
	lineEdit.getInput(function (value) {
		script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, settings.attr, value, function (err, res) {
			err ?
				script.widgetManager.createInformationDialog( 'Ошибка', 'Не удалось применить настройку').show() :
				script.widgetManager.createInformationDialog( 'Уведомление', 'Настройка применена').show()
		});
	});

	lineEdit.show()
};