module.exports = {};

module.exports.informNoDriver = function(scriptLauncher, phone_number, order_id, city_id, scenario)
{
  scriptLauncher.runInformPassengerNoDriver(phone_number, order_id, city_id, scenario);
};

module.exports.informDriverWait = function(scriptLauncher, phone_number, car_number, car_color, order_id, city_id, price, scenario)
{
  scriptLauncher.runInformPassengerDriverWait(phone_number, car_number, car_color, order_id, city_id, price, scenario);
};

module.exports.informDriverWaitAndDiscount = function(scriptLauncher, phone_number, new_price, car_number, car_color, discount_descriptions, order_id, city_id, scenario)
{
  scriptLauncher.runInformPassengerDriverWaitAndDiscount(phone_number, new_price, car_number, car_color, discount_descriptions, order_id, city_id, scenario);
};

module.exports.informCarWillArrive = function(scriptLauncher, phone_number, car_number, car_color, order_id, city_id, price, scenario)
{
  scriptLauncher.runInformCarWillArrive(phone_number, car_number, car_color, order_id, city_id, price, scenario);
};

module.exports.informOrderHasChanged = function(scriptLauncher, phone_number, price, distance, time, order_id, city_id, scenario)
{
  scriptLauncher.runInformOrderHasChanged(phone_number, price, distance, time, order_id, city_id, scenario);
};

module.exports.informNotifyRoomInShift = function(scriptLauncher, notification_id, city_id, shift_price, shift_start_time, shift_free_rooms_count, phone_number_list, scenario)
{
  scriptLauncher.runInformNotifyRoomInShift(notification_id, city_id, shift_price, shift_start_time, shift_free_rooms_count, phone_number_list, scenario);
};

module.exports.askPassengerToRateDriver = function(scriptLauncher, phone_number, order_id, city_id, scenario)
{
  scriptLauncher.runAskPassengerToRateDriver(phone_number, order_id, city_id, scenario);
};