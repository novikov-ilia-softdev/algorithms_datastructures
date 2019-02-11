module.exports = {}

var self = this

module.exports.show = function( script, settings){
	var menuItemList = [
		{title: 'Вкл', getValues: ['ok', 'no_configuration', 'no_connection', 'on'], setValue: 'on'},
		{title: 'Выкл', getValues: ['off'], setValue: 'off'}
	];

	self.showMenu( script,
				   settings.title,
				   settings.sdrRemoteObject,
				   script.attributes.sdrDeviceStatus.name,
				   menuItemList,
				   settings.callback)
};

self.showMenu = function( script, menuName, remoteObject, attr, menuItemsList, callback){
	var menu = script.widgetManager.createMenu( menuName)

	script.getRemoteObjectHelper().getAttr( remoteObject, attr, function (err, res) {
		if( !err) {
			var curVal = JSON.parse( res).status
			self.repaintMenu( script, menu, curVal, remoteObject, attr, menuItemsList, true, callback)
		}
	})
};

self.repaintMenu = function( script, menu, value, remoteObject, attr, menuItemsList, needToShow, callback){
	menu.removeAllListeners()
	menu.clear()

	menuItemsList.forEach( function( menuItem){
		var title = self.isGetValue( value, menuItem.getValues) ? '* ' + menuItem.title : '  ' + menuItem.title
		var menuItemIndex = menu.addEmptyItem( title, false)

		menu.onActivateItem( menuItemIndex, function(){

			script.getRemoteObjectHelper().setAttr( remoteObject, attr, JSON.stringify( { status: menuItem.setValue }), function (err, res) {
				if( !err) {
					self.repaintMenu( script, menu, menuItem.setValue, remoteObject, attr, menuItemsList, false)
					if( callback)
						callback()
				}
			})
		})
	})

	needToShow ? menu.show() : menu.repaint()
};

self.isGetValue = function( value, getValues){
	return getValues.indexOf( value) != -1
};