module.exports = {}

var converter = require( '../../../../../../utils/converter')

module.exports.show = function( script, settings){
	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrFreq.name, function (err, res) {
		if( !err) {
			var lineEdit = script.widgetManager.createLineEdit( 'Частота (кГц)', converter.fromHzToKHz( res));

			lineEdit.getInput(function (value) {
				script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrFreq.name, converter.fromKHzToHz( value), function (err, res) {
					err ?
						script.widgetManager.createInformationDialog( 'Ошибка', 'Не удалось применить настройку').show() :
						script.widgetManager.createInformationDialog( 'Уведомление', 'Настройка применена').show()
				});
			});

			lineEdit.show()
		}
	})
};