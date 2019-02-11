module.exports = {}

module.exports.show = function( script, settings, item){
	var menu = script.widgetManager.createMenu( settings.title);

	var menuItems = []

	for( var i = settings.minIndex; i < settings.maxIndex; i++){
		menuItems.push( { title: 'Диап ' + (i + 1),
						  menu: 'range/freq',
						  index: i
						})
	}

	menuItems.forEach( function( menuItem){
		var menuItemIndex = menu.addEmptyItem( menuItem.title, false)

		menu.onActivateItem( menuItemIndex, function(){
			settings.index = settings.minIndex + menuItemIndex
			require( './' + menuItem.menu + '/menu').show( script, settings)
		})
	})

	menu.show()
};