module.exports = FreeRecord;

var moment = require( 'moment-timezone');
var timeHelper = require( '../scripts/utils/timehelper');

function FreeRecord( begin, end, midnight, timezone){
    var self = this;

    if( !begin || !end || !midnight || !timezone)
        throw new Error( 'not a FreeRecord');

    self.begin = begin;
    self.end = end;
    self.midnight = midnight;
    self.timezone = timezone;

    self.timeStamp = moment.unix( midnight + begin);
    self.timeStamp.tz( self.timezone);
    self.humanReadableDate = timeHelper.createHumanReadableDate( self.timeStamp, false);
    self.minutes = self.timeStamp.hours() * 60 + self.timeStamp.minutes();

    self.humanReadableRelativeTime = timeHelper.createHumanReadableRelativeTime( self.timeStamp, self.timezone);
}
