module.exports = {}

module.exports.show = function( script, settings){

	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrFhssChannelNumber.name, function (err, res) {
		if( !err){
			var lineEdit = script.widgetManager.createLineEdit( settings.title, res);

			lineEdit.getInput(function (value) {
				script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrFhssChannelNumber.name, value, function (err, res) {
					err ?
						script.widgetManager.createInformationDialog( 'Ошибка', 'Не удалось применить настройку').show() :
						script.widgetManager.createInformationDialog( 'Уведомление', 'Настройка применена').show()
				});
			});

			lineEdit.show()
		}
	});
};