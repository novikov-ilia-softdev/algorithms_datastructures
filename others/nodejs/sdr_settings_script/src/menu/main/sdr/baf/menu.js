module.exports = {}

module.exports.show = function( script, settings){
	var menuItemsList = [
		{title: 'Выкл', value: '30-108'},
		{title: 'Вкл диап(30-50)', value: '30-50'},
		{title: 'Вкл диап(65-108)', value: '65-108'}
	];

	require( '../../../../utils/interactivemenu').show( script,
														settings.title,
														settings.sdrRemoteObject,
														script.attributes.sdrBaf.name,
														menuItemsList)
};