var RouteList = module.exports = [];
RouteList.informNewRecord = '/doctor/:doctor_phone_number/patient/:patient_phone_number/records/:id';
RouteList.remindRecord = '/doctor/:doctor_phone_number/patient/:patient_phone_number/remind_record/:id';
RouteList.remindRecordWithCancelAsk = '/doctor/:doctor_phone_number/patient/:patient_phone_number/remind_record_with_cancel_ask/:id';