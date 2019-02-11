module.exports = {}

var self = this

module.exports.show = function( script, menuName, remoteObject, attr, menuItemsList, selectCurItemOpts, callback){
	var menu = script.widgetManager.createMenu( menuName)

	script.getRemoteObjectHelper().getAttr( remoteObject, attr, function (err, res) {
		if( !err) {
			self.repaintMenu( script, menu, res, remoteObject, attr, menuItemsList, true, selectCurItemOpts, callback)
		}
	})
};

self.repaintMenu = function( script, menu, value, remoteObject, attr, menuItemsList, needToShow, selectCurItemOpts, callback){
	menu.removeAllListeners()
	menu.clear()

	menuItemsList.forEach( function( menuItem){
		var title = value == menuItem.value ? '* ' + menuItem.title : '  ' + menuItem.title
		var menuItemIndex = menu.addEmptyItem( title, false)

		menu.onActivateItem( menuItemIndex, function(){

			var setValue = ( menuItem.value == value && selectCurItemOpts && selectCurItemOpts.handleSelectCurItem) ?
				selectCurItemOpts.value : menuItem.value

			script.getRemoteObjectHelper().setAttr( remoteObject, attr, setValue, function (err, res) {
				if( !err) {
					self.repaintMenu( script, menu, setValue, remoteObject, attr, menuItemsList, false, selectCurItemOpts)
					if( callback)
						callback()
				}
			})
		})
	})

	needToShow ? menu.show() : menu.repaint()
};