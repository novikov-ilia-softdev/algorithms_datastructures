module.exports = {}

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( settings.title);

	menuItems = [
		{ title: 'Нач.част.', isBegin: true},
		{ title: 'Кон.част.', isBegin: false}
	]

	menuItems.forEach( function( item){
		var menuItemIndex = menu.addEmptyItem( item.title, false)

		menu.onActivateItem( menuItemIndex, function(){
			settings.isBegin = item.isBegin
			require( './freq/menu').show( script, settings)
		})
	})

	menu.show()
};