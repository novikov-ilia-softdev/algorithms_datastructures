module.exports = {}

var self = this

module.exports.show = function( script){
	self.getInfo( script)
};

self.getInfo = function( script){
	var sdrRemoteObjects = [];
	sdrRemoteObjects.push( script.getRemoteObject( script.getControlObjectNames().sdr1));
	sdrRemoteObjects.push( script.getRemoteObject( script.getControlObjectNames().sdr2));

	settings = []

	sdrRemoteObjects.forEach( function( sdrRemoteObject){
		script.getRemoteObjectHelper().getAttr( sdrRemoteObject, script.attributes.sdrDeviceStatus.name, function (err, res) {
			if( settings.length == 0)
				settings.push( { prefix: 'УП1', title: 'УП1: ' + self.getStatus( err, res), sdrRemoteObject: sdrRemoteObject, menu: 'current'})

			else if( settings.length == 1)
				settings.push( { prefix: 'УП2', title: 'УП2: ' + self.getStatus( err, res), sdrRemoteObject: sdrRemoteObject, menu: 'current'})

			if( settings.length == 2)
				self.showMenu( script, settings)
		})
	})
}

self.showMenu = function( script, settings){
	settings.push( { prefix: 'УП1', title: 'Настройка УП1', sdrRemoteObject: script.getRemoteObject( script.getControlObjectNames().sdr1), menu: 'sdr'})
	settings.push( { prefix: 'УП2', title: 'Настройка УП2', sdrRemoteObject: script.getRemoteObject( script.getControlObjectNames().sdr2), menu: 'sdr'})

	var menu = script.widgetManager.createMenu( 'УП');

	settings.forEach( function( settingsItem){
		var menuItemIndex = menu.addEmptyItem( settingsItem.title, false)

		callback = function(){
			script.getRemoteObjectHelper().getAttr( settingsItem.sdrRemoteObject, script.attributes.sdrDeviceStatus.name, function (err, res) {
				menuItemIndexToReplace = menuItemIndex
				if( settingsItem.menu == 'sdr')
					menuItemIndexToReplace -= 2
				menu.replaceEmptyItem( menuItemIndexToReplace,
									   settingsItem.prefix + ': ' + self.getStatus( err, res),
									   false)
				menu.repaint()
			})
		}
		settingsItem.callback = callback

		menu.onActivateItem( menuItemIndex, function(){
			require( './' + settingsItem.menu + '/menu').show( script, settingsItem)
		})
	})

	menu.onClose( script.exitScript)
	menu.show()
}

self.getStatus = function( err, statusStr){
	if( err)
		return ''

	var statusObj = null

	try{
		statusObj = JSON.parse( statusStr)
	}
	catch( ex){
		return ''
	}

	var status = ''
	if( statusObj.status == 'ok' && statusObj.name)
		return statusObj.name
	else{
		var humanReadableStatuses = {
			'no_configuration': 'нет конф-ии',
			'off': 'выкл',
			'no_connection': 'не готов'
		}

		if( humanReadableStatuses[ statusObj.status])
			return humanReadableStatuses[ statusObj.status]
	}

	return ''
}