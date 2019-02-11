module.exports = {}

var self = this

module.exports.show = function( script, settings, menuItem){
	self.getProfiles( script, settings, menuItem)
};

self.getProfiles = function( script, settings, menuItem){
	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrConvProfileList.name, function (err, res) {
		if( !err) {
			var profiles = JSON.parse( res)
			self.getProfileForChannel( script, settings, menuItem, profiles)
		}
	})
};

self.getProfileForChannel = function( script, settings, menuItem, profiles){
	script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrNumber.name, menuItem.number, function (err, res) {
		if( !err) {
			script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrChannelProfile.name, function (err, res) {
				if( !err) {
					curProfile = res
					var menu = script.widgetManager.createMenu( menuItem.title)
					self.repaintMenu( menu, script, settings, menuItem, profiles, curProfile, true)
				}
			})
		}
	})
};

self.repaintMenu = function( menu, script, settings, menuItem, profiles, curProfile, needToShow){
	menu.removeAllListeners()
	menu.clear()

	profiles.forEach( function( profile){
		var title = curProfile == profile ? '* ' + profile : '  ' + profile
		var menuItemIndex = menu.addEmptyItem( title, false)

		menu.onActivateItem( menuItemIndex, function(){

			var setValue = { number: menuItem.number, name: profiles[ menuItemIndex] }

			if( profiles[ menuItemIndex] == curProfile)
				setValue.name = ''

			script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrChannelProfile.name, JSON.stringify( setValue), function (err, res) {
				if( !err) {
					newCurProfile = profiles[ menuItemIndex];
					self.repaintMenu( menu, script, settings, menuItem, profiles, newCurProfile)
				}
			})
		})
	})

	needToShow ? menu.show() : menu.repaint()
};