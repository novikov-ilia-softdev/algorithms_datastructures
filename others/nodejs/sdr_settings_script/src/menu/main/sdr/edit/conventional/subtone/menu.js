module.exports = {}

var self = this

var subtones = [
	0.0,
	33.0,  35.4,  36.6,  37.9,   39.6,   44.4,   47.5,   49.2, //1-8
	51.2,  53.0,  54.9,  56.8,   58.8,   63.0,   67.0,   69.4, //9-16
	71.9,  74.4,  77.0,  79.7,   82.5,   85.4,   88.5,   91.5, //17-24
	94.8,  97.4, 100.0, 103.5,  107.2,  110.9,  114.8,  118.8, //25-32
	123.0, 125.0, 127.3, 131.8,  136.5,  141.3,  146.2,  151.4, //33-40
	156.7, 159.8, 162.2, 165.5,  167.9,  171.3,  173.8,  177.3, //41-48
	179.9, 183.5, 186.2, 189.9,  192.8,  196.6,  199.5,  203.5, //49-56
	206.5, 210.7, 218.1, 225.7,  229.1,  233.6,  241.8,  250.3, //57-64
	254.1  //65
]

var menuItemsCount = 6

module.exports.show = function( script, settings){
	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, settings.attr, function (err, res) {
		if( !err) {
			settings.curValue = res
			self.showMainMenu( script, settings)
		}
	})
};

self.showMainMenu = function( script, settings){
	var menu = script.widgetManager.createMenu( settings.title)
	menu.addEmptyItem( 'Текущий-' + subtones[ settings.curValue] + ' Гц', false)

	var index = menu.addEmptyItem( 'Изменить', false)
	settings.mainMenu = menu
	menu.onActivateItem( index, function(){
		self.showIntervalMenu( script, settings)
	})

	menu.show()
};

self.showIntervalMenu = function( script, settings){
	var menu = script.widgetManager.createMenu( 'Интервал')
	var partsCount = subtones.length / menuItemsCount
	var intervals = []
	for( var i = 0; i < partsCount; i++){
		intervals.push({start: i * menuItemsCount, end: i * menuItemsCount + menuItemsCount - 1})
	}

	intervals.forEach( function( interval){
		var menuItemIndex = menu.addEmptyItem( subtones[ interval.start] + '-' + subtones[ interval.end], false)

		settings.intervalMenu = menu;

		menu.onActivateItem( menuItemIndex, function(){

			settings.interval = interval
			self.showValueMenu( script, settings)
		})
	})

	menu.show()
};

self.showValueMenu = function( script, settings){
	var interval = []
	for( var i = settings.interval.start; i <= settings.interval.end; i++){
		interval.push( subtones[ i])
	}

	var menu = script.widgetManager.createMenu( 'Значение')

	interval.forEach( function( value){
		var index = menu.addEmptyItem( value, false)
		menu.onActivateItem( index, function(){

			script.getRemoteObjectHelper().setAttr( settings.sdrRemoteObject, settings.attr, subtones.indexOf( interval[ index]), function (err, res) {
				if( !err) {
					menu.close();
					settings.intervalMenu.close()
					settings.mainMenu.replaceEmptyItem( 0, 'Текущий-' + interval[ index] + ' Гц',  false)
					settings.mainMenu.repaint()
				}
			})
		})
	})

	menu.show()
};