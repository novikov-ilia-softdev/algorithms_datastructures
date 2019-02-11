module.exports = {}

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( settings.title);

	menuItems = [
		{ title: 'Код страны MCC', menu: 'utils/lineedit', attr: script.attributes.sdrCountryCode.name},
		{ title: 'Код сети MNC', menu: 'utils/lineedit', attr: script.attributes.sdrNetworkCode.name},
		{ title: 'Номер станции ISSI', menu: 'utils/lineedit', attr: script.attributes.sdrContactId.name},
		{ title: 'Номер группы GSSI', menu: 'utils/lineedit', attr: script.attributes.sdrMainGroupId.name},
		{ title: 'Доп.группа 1', menu: 'utils/lineedit', attr: script.attributes.sdrFirstExtraGroupId.name},
		{ title: 'Доп.группа 2', menu: 'utils/lineedit', attr: script.attributes.sdrSecondExtraGroupId.name},
		{ title: 'Доп.группа 3', menu: 'utils/lineedit', attr: script.attributes.sdrThirdExtraGroupId.name},
		{ title: 'Доп.группа 4', menu: 'utils/lineedit', attr: script.attributes.sdrFourthExtraGroupId.name},
		{ title: 'Время ответа', menu: 'utils/lineedit', attr: script.attributes.sdrIncomingCallAnswerTime.name}
	]

	menuItems.forEach( function( item){
		var menuItemIndex = menu.addEmptyItem( item.title, false)

		menu.onActivateItem( menuItemIndex, function(){
			settings.title = item.title
			settings.attr = item.attr
			require( './' + item.menu + '/menu').show( script, settings)
		})
	})

	menu.show()
};