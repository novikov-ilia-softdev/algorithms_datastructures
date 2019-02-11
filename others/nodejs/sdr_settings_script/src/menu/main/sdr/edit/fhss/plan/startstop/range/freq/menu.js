module.exports = {}

var self = this

var converter = require( '../../../../../../../../../utils/converter')

module.exports.show = function( script, settings){
	settings.attr = script.attributes.dn1.name
	self.getFreqRangeForChannelByNumber( script, settings)
};

self.getFreqRangeForChannelByNumber = function( script, settings){
	script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrNumber.name, settings.index + 1, function (err, res) {
		if( !err) {
			script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, settings.attr, function (err, res) {
				if( !err) {
					var range = JSON.parse( res)
					self.showLineEdit( script, settings, range)
				}
			})
		}
	})
};

self.showLineEdit = function( script, settings, range){

    var lineEdit = script.widgetManager.createLineEdit( 'нач-кон(кГц)', range.begin + '-' +  range.end);

    lineEdit.getInput(function (value) {

		var inputArr = value.split( '-')

		if( inputArr.length != 2){
			script.widgetManager.createInformationDialog( 'Ошибка', 'Ощибка ввода').show()
			return
		}

		var setValue = {}
		setValue.number = settings.index + 1
		setValue.begin = inputArr[ 0]
		setValue.end = inputArr[ 1]

        script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, settings.attr, JSON.stringify( setValue), function (err, res) {
			err ?
				script.widgetManager.createInformationDialog( 'Ошибка', 'Не удалось применить настройку').show() :
				script.widgetManager.createInformationDialog( 'Уведомление', 'Настройка применена').show()
        });
    });

    lineEdit.show()
};