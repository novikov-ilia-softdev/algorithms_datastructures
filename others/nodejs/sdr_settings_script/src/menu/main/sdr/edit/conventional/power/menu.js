module.exports = {}

module.exports.show = function( script, settings){
	var menuItemsList = [
		{title: 'Минимальная', value: '0'},
		{title: 'Низкая', value: '1'},
		{title: 'Средняя', value: '2'},
		{title: 'Высокая', value: '3'},
		{title: 'Максимальная', value: '4'}
	];

	require( '../../../../../../utils/interactivemenu').show( script,
		settings.title,
		settings.sdrRemoteObject,
		script.attributes.signalPower.name,
		menuItemsList)
};