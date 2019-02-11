module.exports = {}

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( 'Сканирование');

	menuItems = []

	menuItems.push( { title: 'Осн.ЗПЧ', menu: 'base'})
	menuItems.push( { title: 'Список скан-ия', menu: 'scanlist'})
	menuItems.push( { title: 'Время ответа', menu: 'timestep'})

	menuItems.forEach( function( item){
		var menuItemIndex = menu.addEmptyItem( item.title, false)

		menu.onActivateItem( menuItemIndex, function(){
			require( './' + item.menu + '/menu').show( script, settings, item)
		})
	})

	menu.show()
};