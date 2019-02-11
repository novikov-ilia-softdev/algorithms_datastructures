module.exports = {}

var self = this

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( settings.title)

	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrProfileList.name, function (err, res) {
		if( !err) {
			var profileList = JSON.parse( res)

			self.repaint( script, menu, profileList, settings, true)
		}
	})
};

self.repaint = function( script, menu, profileList, settings, needToShow){
	menu.removeAllListeners()
	menu.clear()

	profileList.forEach( function( profile){

		var menuItemIndex = menu.addEmptyItem( profile, false)

		menu.onActivateItem( menuItemIndex, function(){

			var yesNoMenu = script.widgetManager.createMenu( 'Удалить ' + profile + '?')
			yesIndex = yesNoMenu.addEmptyItem( 'Да', true)
			yesNoMenu.addEmptyItem( 'Нет', true)
			yesNoMenu.onActivateItem( yesIndex, function(){
				script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrDeleteProfile.name, profile, function (err, res) {
					if( !err){
						var newProfileList = []

						for( var i in profileList){
							if( profileList[ i] != profile)
								newProfileList.push( profileList[ i])
						}

						self.repaint( script, menu, newProfileList, settings)
					}
				});
			})

			yesNoMenu.show()
		})

	})

	needToShow ? menu.show() : menu.repaint()
};