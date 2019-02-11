module.exports = {}

var converter = require( '../../../../../../utils/converter')

var self = this

module.exports.show = function( script, settings){
	var menu = script.widgetManager.createMenu( 'Скан.прм.')

	script.getRemoteObjectHelper().getAttr( settings.sdrRemoteObject, script.attributes.sdrFreq.name, function (err, res) {
		if( !err) {
			self.repaint( script, menu, res, settings, true)
		}
	})
};

self.repaint = function( script, menu, value, settings, needToShow){
	menu.removeAllListeners()
	menu.clear()

	menu.addEmptyItem("Частота: " + converter.fromHzToKHz( value) + " кГц", false);
	menu.addSetAttributeItem("Сканировать", settings.sdrRemoteObject, script.attributes.sdrFreqScan.name, "1", function (err, res) {
		var dialog = err ?
						script.widgetManager.createInformationDialog("Ошибка", "Не удалось начать сканирующий прием") :
						script.widgetManager.createInformationDialog("Уведомление", "Идет сканирующий прием...");
		dialog.show()

		self.subscribeOnNotifications( script, settings, menu, dialog)
	});

	menu.addSetAttributeItem("Принять", settings.sdrRemoteObject, script.attributes.sdrAcceptFreqScan.name, value, function (err, res) {
		menu.close();
	});

	menu.addSetAttributeItem("Отменить", settings.sdrRemoteObject, script.attributes.sdrCancelFreqScan.name, "1", function (err, res) {
		menu.close();
	});

	menu.onClose( function() {
		script.getRemoteObjectHelper().setAttr(settings.sdrRemoteObject, script.attributes.sdrCancelFreqScan.name, "1", function (err, res) {});
	});

	needToShow ? menu.show() : menu.repaint()
};

self.subscribeOnNotifications = function ( script, settings, menu, dialog) {
	var ControlSerialization = require('control_serialization_lib');
	var MessageSerializer = ControlSerialization.MessageSerializer;
	var EventHelper = ControlSerialization.EventHelper;

	var messageSerializer = new MessageSerializer();

	var SDR_FREQUENCY_EVENT_ID = "Frequency";

	var eventHandlersMap = {};
	eventHandlersMap[SDR_FREQUENCY_EVENT_ID] = sdrFrequencyEventHandler;

	var events = [];
	var sdrFrequencyEvent = EventHelper.createEvent(settings.sdrRemoteObject.name, SDR_FREQUENCY_EVENT_ID);

	events.push(sdrFrequencyEvent);

	var isSubscribed = false;

	script.getRemoteSubject().subscribe(script.controlObject.name, events, function (err, res, notification) {
		if (err != null) {
			script.getLogger().logError("Не удалось подписаться на уведомления");
		}
		else if (!isSubscribed) {
			isSubscribed = true;
			script.getLogger().logMessage("Подписан на уведомления");
		}

		if (notification != null) {
			var message = messageSerializer.parseFromBuffer(notification.message);

			if (message.call != null) {
				if (message.call.event != null && eventHandlersMap.hasOwnProperty(message.call.event.id)) {

					script.getLogger().logAboutEvent(message.call.event, function () {
						eventHandlersMap[message.call.event.id]( script, settings, menu, dialog, message.call.event);
					});
				}
			}
		}
	});
};

sdrFrequencyEventHandler = function( script, settings, menu, dialog, event){
	dialog.close();
	self.repaint( script, menu, event.data, settings)
};

