module.exports = {}

module.exports.show = function( script, settings){
	var menuItemsList = [
		{title: '1.2 Кбит/c', value: 1200},
		{title: '2.4 Кбит/c', value: 2400},
		{title: '4.8 Кбит/c', value: 4800},
		{title: '9.6 Кбит/c', value: 9600},
		{title: '16 Кбит/c', value: 16000},
		{title: '32 Кбит/c', value: 32000},
		{title: '48 Кбит/c', value: 48000},
		{title: '64 Кбит/c', value: 64000}
	];

	require( '../../../../../../utils/interactivemenu').show( script,
		settings.title,
		settings.sdrRemoteObject,
		script.attributes.rate.name,
		menuItemsList)
};