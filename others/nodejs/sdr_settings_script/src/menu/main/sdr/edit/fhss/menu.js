module.exports = {}

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( 'ППРЧ');

	menuItems = [
		{ title: 'Част.план', menu: 'plan'},
		{ title: 'Номер лог.кан.', menu: 'logicchannelnumber'},
		{ title: 'Период синхр.', menu: 'syncperiod'},
		{ title: 'Радиомолчание', menu: 'radiosilence'},
		{ title: 'Мощность', menu: 'power'},
		{ title: 'Адресация', menu: 'addressparams'},
	]

	menuItems.forEach( function( item){
		var menuItemIndex = menu.addEmptyItem( item.title, false)

		menu.onActivateItem( menuItemIndex, function(){
			settings.title = item.title
			require( './' + item.menu + '/menu').show( script, settings, item)
		})
	})

	menu.show()
};