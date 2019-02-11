module.exports = {}

module.exports.show = function( script, settings){
	var menuItemsList = [
		{title: 'Вкл', value: '1'},
		{title: 'Выкл', value: '0'},
	];

	require( '../../../../../../utils/interactivemenu').show( script,
		settings.title,
		settings.sdrRemoteObject,
		script.attributes.transmitterOff.name,
		menuItemsList)
};