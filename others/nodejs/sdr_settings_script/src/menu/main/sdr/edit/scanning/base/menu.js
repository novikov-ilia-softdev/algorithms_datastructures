module.exports = {}

module.exports.show = function( script, settings){

	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrConvProfileList.name, function (err, res) {
		if( !err) {
			var profileList = JSON.parse( res)
			var menuItemsList = []
			profileList.forEach( function( profile){
				menuItemsList.push( { title: profile, value: profile})
			})

			require( '../../../../../../utils/interactivemenu').show( script,
				settings.title,
				settings.sdrRemoteObject,
				script.attributes.sdrBaseChannel.name,
				menuItemsList,
				{ handleSelectCurItem: true, value: '' }
			)
		}
	})
};