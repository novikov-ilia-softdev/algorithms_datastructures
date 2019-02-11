module.exports = {}

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( settings.title);

	menuItems = [
		{ title: 'Создать', menu: 'add'},
		{ title: 'Редактировать', menu: 'edit'},
		{ title: 'Удалить', menu: 'delete'},
		{ title: 'Вкл/выкл', menu: 'state'},
		{ title: 'БАФ', menu: 'baf'},
	]

	menuItems.forEach( function( item){
		var menuItemIndex = menu.addEmptyItem( item.title, false)

		menu.onActivateItem( menuItemIndex, function(){
			settings.title = item.title
			require( './' + item.menu + '/menu').show( script, settings)
		})
	})

	menu.show()
};