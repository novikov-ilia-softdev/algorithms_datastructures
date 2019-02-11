module.exports = {}

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( 'Сканирование');

	menuItems = []

	for( var i = 0; i < 8; i++){
		menuItems.push( { title: 'Канал ' + (i + 1), menu: 'profile', number: i})
	}

	menuItems.forEach( function( item){
		var menuItemIndex = menu.addEmptyItem( item.title, false)

		menu.onActivateItem( menuItemIndex, function(){
			require( './' + item.menu + '/menu').show( script, settings, item)
		})
	})

	menu.show()
};