module.exports = {}

module.exports.show = function( script, settings){
	var menuItemsList = [
		{title: 'ЧМ-25 кГц', value: '0'},
		{title: 'ЧМ-12.5 кГц', value: '1'},
		//{title: '2FSK', value: '2'},
		//{title: 'BPSK', value: '3'},
		//{title: 'QPSK', value: '4'}
	];

	require( '../../../../../../utils/interactivemenu').show( script,
		settings.title,
		settings.sdrRemoteObject,
		script.attributes.mdl.name,
		menuItemsList)
};