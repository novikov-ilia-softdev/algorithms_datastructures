module.exports = {}

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( settings.title)

	menuItems = [
		{ title: 'ЧМ', menu: 'create', attr: script.attributes.sdrAddConvProfile.name},
		{ title: 'Скан', menu: 'create', attr: script.attributes.sdrAddScanProfile.name},
		{ title: 'ППРЧ', menu: 'create', attr: script.attributes.sdrAddFhssProfile.name},
		{ title: 'Копировать', menu: 'copy'}
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