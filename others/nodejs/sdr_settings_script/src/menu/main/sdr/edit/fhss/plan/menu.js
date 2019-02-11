module.exports = {}

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( settings.title);

	menuItems = [
		{ title: 'Диап(1-5)', menu: 'startstop', minIndex: 0, maxIndex:5},
		{ title: 'Диап(6-10)', menu: 'startstop', minIndex: 5, maxIndex:10},
		{ title: 'Диап(11-15)', menu: 'startstop', minIndex: 10, maxIndex:15},
		{ title: 'Диап(16-20)', menu: 'startstop', minIndex: 15, maxIndex:20},
		{ title: 'Диап(21-25)', menu: 'startstop', minIndex: 20, maxIndex:25},
		{ title: 'Диап(26-30)', menu: 'startstop', minIndex: 25, maxIndex:30},
		{ title: 'Диап(31-32)', menu: 'startstop', minIndex: 30, maxIndex:32},
	]

	menuItems.forEach( function( item){
		var menuItemIndex = menu.addEmptyItem( item.title, false)

		menu.onActivateItem( menuItemIndex, function(){
			settings.minIndex = item.minIndex
			settings.maxIndex = item.maxIndex
			settings.title = item.title
			require( './' + item.menu + '/menu').show( script, settings)
		})
	})

	menu.show()
};