module.exports = {}

module.exports.show = function( script, settings){
	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrProfileList.name, function (err, res) {
		if( !err) {
			var profileList = JSON.parse( res)
			var menuItemsList = []
			profileList.forEach( function( profile){
				menuItemsList.push( { title: profile, value: profile})
			})

			require( '../../../utils/interactivemenu').show( script,
				settings.title.substring( 0, settings.title.indexOf(':')),
				settings.sdrRemoteObject,
				script.attributes.sdrActiveProfile.name,
				menuItemsList,
				null,
				settings.callback)
		}
	})
};