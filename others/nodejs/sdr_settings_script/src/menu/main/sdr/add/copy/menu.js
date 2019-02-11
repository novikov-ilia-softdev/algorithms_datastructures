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
	var menu = script.widgetManager.createMenu( 'откуда')

	profileList.forEach( function( profile){
		var menuItemIndex = menu.addEmptyItem( profile, false)
		menu.onActivateItem( menuItemIndex, function(){
			self.showLineEdit( script, settings, profile, menu)
		})
	})

	menu.show();
};

self.showLineEdit = function( script, settings, srcProfile, menu){
	var lineEdit = script.widgetManager.createLineEdit( 'куда');
	lineEdit.getInput(function (value) {

		var obj = { srcProfileName: srcProfile, dstProfileName: value }

		script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, script.attributes.sdrCopyProfile.name, JSON.stringify( obj), function (err, res) {
			err ?
				script.widgetManager.createInformationDialog( 'Ошибка', 'Не удалось применить настройку').show() :
				script.widgetManager.createInformationDialog( 'Уведомление', 'Настройка применена').show()

			menu.close()
		});
	});

	lineEdit.show()
};