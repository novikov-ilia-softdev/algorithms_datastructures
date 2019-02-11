module.exports = {}

var self = this;

module.exports.show = function( script, settings){

	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrProfileList.name, function (err, res) {
		if( !err) {
			var profileList = JSON.parse( res)
			self.showMenu( script, settings, profileList)
		}
	})
};

self.showMenu = function( script, settings, profileList){
	var menu = script.widgetManager.createMenu( settings.title)

	profileList.forEach( function( profile){
		var menuItemIndex = menu.addEmptyItem( profile, false)
		menu.onActivateItem( menuItemIndex, function(){
			self.setCurrentProfile( script, settings, profile)
		})
	})

	menu.show();
};

self.setCurrentProfile = function( script, settings, profile){
	script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrCurrentProfile.name, profile, function (err, res) {
		if( !err) {
			self.getCurrentProfileType( script, settings, profile)
		}
	})
};

self.getCurrentProfileType = function( script, settings, profile){
	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrProfileType.name, function (err, res) {
		if( !err) {
			var profileInfo = { name: profile, type: res }
			self.showEditMenu( script, settings, profileInfo)
		}
	})
};

self.showEditMenu = function( script, settings, profileInfo){
	var valueOnMenuMap = {
		'conv': 'conventional',
		'scan': 'scanning',
		'fh': 'fhss'
	}

	if( valueOnMenuMap.hasOwnProperty( profileInfo.type))
		require( './' + valueOnMenuMap[ profileInfo.type] + '/menu').show( script, settings)
};