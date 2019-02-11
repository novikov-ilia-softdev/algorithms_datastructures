module.exports = {}

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( 'Настройка')

	menuItems = [
		{ title: 'Частота', menu: 'recvfreq'},
		{ title: 'Модуляция', menu: 'modulation'},
		{ title: 'Скорость', menu: 'rate'},
		{ title: 'Радиомолчание', menu: 'radiosilence'},
		{ title: 'Мощность', menu: 'power'},
		{ title: 'Подавитель шума', menu: 'noizesuppress'},
		{ title: 'Субтон передачи', menu: 'subtone', attr: script.attributes.sdrTransmitSubTone.name},
		{ title: 'Субтон приема', menu: 'subtone', attr: script.attributes.sdrReceiveSubTone.name},
		{ title: 'Скан.прм.', menu: 'scanrecv'},
		{ title: 'Двухчастот.симплекс', menu: 'dualsimplex'}
	]

	menuItems.forEach( function( item){
		var menuItemIndex = menu.addEmptyItem( item.title, false)

		menu.onActivateItem( menuItemIndex, function(){
			settings.title = item.title
			settings.attr = item.attr
			require( './' + item.menu + '/menu').show( script, settings)
		})
	})

	menu.show();
};