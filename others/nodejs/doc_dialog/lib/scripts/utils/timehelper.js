const conf = require('../../settings/settings').time;

const moment = require('moment-timezone');

module.exports = {};

module.exports.PartOfDay = {
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night',
}

module.exports.getHoursOfDay = function(timezone, utcTime){
  timezone = timezone || conf.defaultTimezone;
  utcTime = utcTime || moment.utc();
  return moment.utc(utcTime).tz(timezone).get('hour');
}

module.exports.getPartOfDay = function(timezone, utcTime){
  var hours = module.exports.getHoursOfDay(timezone, utcTime);

  if (hours <  4) return module.exports.PartOfDay.night;      // 00:00 - 04:00
  if (hours < 11) return module.exports.PartOfDay.morning;    // 00:00 - 11:00
  if (hours < 17) return module.exports.PartOfDay.afternoon;  // 00:00 - 17:00
  if (hours < 23) return module.exports.PartOfDay.evening;    // 00:00 - 23:00
  return module.exports.PartOfDay.night; // 00:00 - 23:59
}

module.exports.isSleepTime = function(timezone, utcTime){
  var hoursOfDay = module.exports.getHoursOfDay(timezone, utcTime);

  if( conf.startSleepHour == conf.stopSleepHour){
    return ( hoursOfDay == conf.startSleepHour);
  }

  if( conf.startSleepHour < conf.stopSleepHour){
    return ( hoursOfDay >= conf.startSleepHour && hoursOfDay <= conf.stopSleepHour);
  }

  if( conf.startSleepHour > conf.stopSleepHour){
    return ( (hoursOfDay >= conf.startSleepHour && hoursOfDay <= 23) ||
             (hoursOfDay >= 0 && hoursOfDay <= conf.stopSleepHour));
  }
}

var createDayOfWeek = function( dayOfWeek){
  if( dayOfWeek == 'вторник')
    return 'во вторник';

  if( dayOfWeek == 'среда')
    return 'в среду';

  if( dayOfWeek == 'пятница')
    return 'в пятницу';

  if( dayOfWeek == 'суббота')
    return 'в субботу';

  return 'в ' + dayOfWeek;
}

module.exports.createHumanReadableDate = function( timeStamp, isNeedDayOfWeek){
  // 1 сентября в пятницу
  var fullDate = timeStamp.locale( 'ru').format('LLLL');
  var dayOfWeek = fullDate.substring( 0, fullDate.indexOf( ','));
  var dateWithYear = fullDate.substring( fullDate.indexOf( ' ') + 1);
  var dateWithoutYear = dateWithYear.substring( 0, dateWithYear.lastIndexOf( ' '));
  dateWithoutYear = dateWithoutYear.substring( 0, dateWithoutYear.lastIndexOf( ' '));
  dateWithoutYear = dateWithoutYear.substring( 0, dateWithoutYear.lastIndexOf( ' '));
  var result = dateWithoutYear;
  if( isNeedDayOfWeek)
    result += ' ' + createDayOfWeek( dayOfWeek);

  return result;
}

var isSameDate = function( date1, date2){
  return ( date1.date() == date2.date() &&
           date1.month() == date2.month() &&
           date1.year() == date2.year())
}

var isRelativeTimeInHours = function( relativeTimeStr){
  return (relativeTimeStr.indexOf( 'час') != -1)
}

var getRelativeTime = function( time1, time2){
  return moment( time1, 'LLLL').from( time2)
}

module.exports.createHumanReadableRelativeTime = function( timeStamp, timezone){
  // сегодня через 2 часа (завтра, послезавтра, через 3 дня...)
  var now = moment();
  now.tz( timezone);

  var relativeTime = getRelativeTime( timeStamp, now);

  if( isRelativeTimeInHours( relativeTime)){
    relativeTime = isSameDate( now, timeStamp) ? 'сегодня ' + relativeTime : 'завтра';
    return relativeTime;
  }

  if( relativeTime == 'через день')
    return 'завтра'

  if( relativeTime == 'через 2 дня')
    return 'послезавтра'

  return relativeTime;
}

