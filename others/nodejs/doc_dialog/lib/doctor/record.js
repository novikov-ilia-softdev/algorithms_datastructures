module.exports = Record;

var moment = require( 'moment-timezone');
var timeHelper = require( '../scripts/utils/timehelper');

var RecordStatus = require( './recordstatus');

function Record( id, status, patientId, doctorId, timeStamp, timezone){
    var self = this;

    if( !id || !patientId || !doctorId || !timezone)
        throw new Error( 'not a Record');

    self.id = id;
    self.status = status;
    self.patientId = patientId;
    self.doctorId = doctorId;
    self.timeStamp = moment.unix( timeStamp);
    self.timezone = timezone;
    self.timeStamp.tz( self.timezone);
    self.humanReadableDate = timeHelper.createHumanReadableDate( self.timeStamp, true);
    self.minutes = self.timeStamp.hours() * 60 + self.timeStamp.minutes();
    self.isDraft = self.status == RecordStatus.draft.value;
    self.isApproved = self.status == RecordStatus.approved.value;
}
