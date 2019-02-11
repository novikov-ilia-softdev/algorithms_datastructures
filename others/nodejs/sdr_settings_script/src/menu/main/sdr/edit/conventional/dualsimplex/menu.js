module.exports = {}

var self = this

var converter = require( '../../../../../../utils/converter')

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( 'Двухчастот.симплекс')

	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.dualSimplex.name, function (err, res) {
		if( !err) {
			var mode = res
			script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrFreqSend.name, function (err, res) {
				if( !err) {
					var freq = res
					self.repaint( script, menu, mode, settings, true, freq)
				}
			})
		}
	})
};

self.repaint = function( script, menu, value, settings, needToShow, freq){
	menu.removeAllListeners()
	menu.clear()

	var menuItemList = [
		{title: 'Вкл', value: '1'},
		{title: 'Выкл', value: '0'},
	];

	menuItemList.forEach( function( menuItem){
		var title = value == menuItem.value ? '* ' + menuItem.title : '  ' + menuItem.title
		var menuItemIndex = menu.addEmptyItem( title, false)

		menu.onActivateItem( menuItemIndex, function(){
			script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.dualSimplex.name, menuItem.value, function (err, res) {
				if( !err) {
					self.repaint( script, menu, menuItem.value, settings, false, freq)
				}
			})
		})
	})

	if( value == '1') {
		var lineEdit = script.widgetManager.createLineEdit( 'Частота (кГц)', converter.fromHzToKHz( freq));

		lineEdit.getInput(function (freqValue) {
			script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrFreqSend.name, converter.fromKHzToHz( freqValue), function (err, res) {
				if( !err) {
					self.repaint( script, menu, value, settings, false, freqValue)
					script.widgetManager.createInformationDialog( 'Уведомление', 'Настройка применена').show()
				}
				else{
					script.widgetManager.createInformationDialog( 'Ошибка', 'Не удалось применить настройку').show()
				}
			});
		});

		menu.addWidgetItem("Част.прд.", lineEdit);
	}

	needToShow ? menu.show() : menu.repaint()
};