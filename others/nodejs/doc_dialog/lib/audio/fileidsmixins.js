var PartOfDay = require('../scripts/utils/timehelper').PartOfDay;

var mixins = function (options){
    var self = this;
  
    self._firstGreetingFileId = "FirstGreeting";
    self.getFirstGreetingFileId = function(){
        return self._firstGreetingFileId;
    };

    self._firstGreetingKamenkaFileId = "FirstGreetingKamenka";
    self.getFirstGreetingKamenkaFileId = function(){
        return self._firstGreetingKamenkaFileId;
    };

    self._firstCallDescriptionFileId = "FirstCallDescription";
    self.getFirstCallDescriptionFileId = function(){
        return self._firstCallDescriptionFileId;
    };

    self._nameRepeatedQueryFileId = "NameRepeatedQuery";
    self.getNameRepeatedQueryFileId = function(){
        return self._nameRepeatedQueryFileId;
    };

    self._locationQueryFileId = "LocationQuery";
    self.getLocationQueryFileId = function(){
        return self._locationQueryFileId;
    };

    self._locationRepeatedQueryFileId = "LocationRepeatedQuery";
    self.getLocationRepeatedQueryFileId = function(){
        return self._locationRepeatedQueryFileId;
    };

    self._destinationQueryFileId = "DestinationQuery";
    self.getDestinationQueryFileId = function(){
        return self._destinationQueryFileId;
    };

    self._destinationRepeatedQueryFileId = "DestinationRepeatedQuery";
    self.getDestinationRepeatedQueryFileId = function(){
        return self._destinationRepeatedQueryFileId;
    };

    self._tripOnCarQueryFileId = "TripOnCarQuery";
    self._tripOnCarQueryWithDiscountFileId = "TripOnCarQueryWithDiscount";
    self._tripOnCarQueryWithMultipleDiscountsFileId = "TripOnCarQueryWithMultipleDiscounts";

    self.getTripOnCarQueryFileId = function(order){
        if (order && order.discounts){
            if (order.discounts.length == 1) return self._tripOnCarQueryWithDiscountFileId;
            if (order.discounts.length > 1)  return self._tripOnCarQueryWithMultipleDiscountsFileId;
        }
        return self._tripOnCarQueryFileId;
    };

    self._driverRecallPhraseFileId = "DriverRecallPhrase";
    self.getDriverRecallPhraseFileId = function(){
        return self._driverRecallPhraseFileId;
    };

    self._driverRecallKamenkaPhraseFileId = "DriverRecallKamenkaPhrase";
    self.getDriverRecallKamenkaPhraseFileId = function(){
        return self._driverRecallKamenkaPhraseFileId;
    };

    self._talkEndPhraseFileId = "TalkEndPhrase";
    self.getTalkEndPhraseFileId = function(){
        return self._talkEndPhraseFileId;
    };

    self._talkEndFirstCallPhraseFileId = "TalkEndFirstCallPhrase";
    self.getTalkEndFirstCallPhraseFileId = function(){
        return self._talkEndFirstCallPhraseFileId;
    };

    self._noRoutePhraseFileId = "NoRoutePhrase";
    self.getNoRoutePhraseFileId = function(){
        return self._noRoutePhraseFileId;
    };

    self._impossibleOrderPhraseFileId = "ImpossibleOrderPhrase";
    self.getImpossibleOrderPhraseFileId = function(){
        return self._impossibleOrderPhraseFileId;
    };

    self._publicTransportQueryFileId = "PublicTransportQuery";
    self.getPublicTransportQueryFileId = function(){
        return self._publicTransportQueryFileId;
    };

    self._carTripRepeatedQueryFileId = "CarTripRepeatedQuery";
    self.getCarTripRepeatedQueryFileId = function(){
        return self._carTripRepeatedQueryFileId;
    };

    self._talkErrorPhraseFileId = "TalkErrorPhraseFileId";
    self.getTalkErrorPhraseFileId = function(){
        return self._talkErrorPhraseFileId;
    };

    self._personalGreetingFileId = "PersonalGreeting";
    self.getPersonalGreetingPhraseFileId = function(){
        return self._personalGreetingFileId;
    };

    self._personalMorningGreetingFileId    = "PersonalMorningGreeting";
    self._personalAfternoonGreetingFileId  = "PersonalAfternoonGreeting";
    self._personalEveningGreetingFileId    = "PersonalEveningGreeting";
    self._personalNightGreetingFileId      = "PersonalNightGreeting";
    self._personalUNKDayPartGreetingFileId = "PersonalUNKDayPartGreeting";
    
    self.getPersonalDayPartGreetingPhraseFileId = function(dayPart){
        switch (dayPart) {
            case (PartOfDay.morning)  : return self._personalMorningGreetingFileId;
            case (PartOfDay.afternoon): return self._personalAfternoonGreetingFileId;
            case (PartOfDay.evening)  : return self._personalEveningGreetingFileId;
            case (PartOfDay.night)    : return self._personalNightGreetingFileId;
            default: return self._personalUNKDayPartGreetingFileId;
        }
    };

    self._MorningGreetingFileId    = "MorningGreeting";
    self._AfternoonGreetingFileId  = "AfternoonGreeting";
    self._EveningGreetingFileId    = "EveningGreeting";
    self._NightGreetingFileId      = "NightGreeting";
    self._UNKDayPartGreetingFileId = "UNKDayPartGreeting";
    
    self.getDayPartGreetingPhraseFileId = function(dayPart){
        switch (dayPart) {
            case (PartOfDay.morning)  : return self._MorningGreetingFileId;
            case (PartOfDay.afternoon): return self._AfternoonGreetingFileId;
            case (PartOfDay.evening)  : return self._EveningGreetingFileId;
            case (PartOfDay.night)    : return self._NightGreetingFileId;
            default: return self._UNKDayPartGreetingFileId;
        }
    };

    self._NameOnlyGreetingPhraseFileId = "NameOnlyGreeting";
    self.getNameOnlyGreetingPhraseFileId = function(){
        return self._NameOnlyGreetingPhraseFileId;
    }

    self._orderDetailsOnlyPriceFileId = "OrderDetailsOnlyPrice";
    self.getOrderDetailsOnlyPricePhraseFileId = function(){
        return self._orderDetailsOnlyPriceFileId;
    };

    self._orderDetailsOnlyPriceKamenkaFileId = "OrderDetailsOnlyPriceKamenka";
    self.getOrderDetailsOnlyPriceKamenkaPhraseFileId = function(){
        return self._orderDetailsOnlyPriceKamenkaFileId;
    };

    self._orderDetailsKamenkaPhraseFileId = "OrderDetailsKamenka";
    self.getOrderDetailsKamenkaPhraseFileId = function(){
        return self._orderDetailsKamenkaPhraseFileId;
    };

    self._orderDetailsFileId = "OrderDetails";
    self.getOrderDetailsPhraseFileId = function(){
        return self._orderDetailsFileId;
    };

    self._orderDetailsUnknownFileId = "OrderDetailsUnknown";
    self.getOrderDetailsUnknownFileId = function(){
        return self._orderDetailsUnknownFileId;
    };

    self._orderCreatedNotificationFileId = "OrderCreatedNotification";
    self.getOrderCreatedNotificationFileId = function(){
        return self._orderCreatedNotificationFileId;
    };

    self._thanksFileIdList = [ "Thanks_0", "Thanks_1", "Thanks_2", "Thanks_3", "Thanks_4"];
    self.getThanksPhraseFileId = function(){
        return self._thanksFileIdList[  self._getRandomInt( 0, self._thanksFileIdList.length - 1)];
    };

    self._activeOrderCancelQueryFileId = "ActiveOrderCancelQuery";
    self.getActiveOrderCancelQueryFileId = function (){
        return self._activeOrderCancelQueryFileId;
    }

    self._activeOrderCanceledPhraseFileId = "ActiveOrderCanceledPhrase";
    self.getActiveOrderCanceledPhraseFileId = function (){
        return self._activeOrderCanceledPhraseFileId;
    }

    self._goodSpeedPhrasePhraseFileId = "GoodSpeedPhrase";
    self.getGoodSpeedPhrasePhraseFileId = function (){
        return self._goodSpeedPhrasePhraseFileId;
    }

    self._activeOrderCancelRepeatQueryFileId = "ActiveOrderCancelRepeatQuery";
    self.getActiveOrderCancelRepeatQueryFileId = function (){
        return self._activeOrderCancelRepeatQueryFileId;
    }

    self._doYouWantACarPhraseFileId = "DoYouWantACarPhrase";
    self.getDoYouWantACarPhraseFileId = function (){
        return self._doYouWantACarPhraseFileId;
    }

    self._weCallYouBackPhraseFileId = "WeCallYouBackPhrase";
    self.getWeCallYouBackPhraseFileId = function (){
        return self._weCallYouBackPhraseFileId;
    }

    self._leaveYourMessageQueryFileId = "LeaveYourMessageQuery";
    self.getLeaveYourMessageQueryFileId = function (){
        return self._leaveYourMessageQueryFileId;
    }

    self._IVRMenuFileId = "IVRMenuPhrase";
    self.getIVRMenuFileId = function (){
        return self._IVRMenuFileId;
    }

    self._priceInfoPhraseFileId = "PriceInfohrase";
    self.getPriceInfoPhraseFileId = function ( cityId){
        return self._priceInfoPhraseFileId+cityId;
    }

    self._preorderInfoPhraseFileId = "PreorderInfoPhrase";
    self.getPreorderInfoPhraseFileId = function (){
        return self._preorderInfoPhraseFileId;
    }

    self._askPassengerToRateDriverPhraseFileId = "AskPassengerToRateDriverPhrase";
    self.getAskPassengerToRateDriverPhraseFileId = function (){
        return self._askPassengerToRateDriverPhraseFileId;
    }

    self._thanksForRatePhraseFileId = "ThanksForRatePhrase";
    self.getThanksForRatePhraseFileId = function (){
        return self._thanksForRatePhraseFileId;
    },

    self._newCityHelloFileId = "NewCityHelloPhrase";
    self.getNewCityHelloFileId = function (){
        return self._newCityHelloFileId;
    }

    self._newCityDoYouWantToWorkFileId = "NewCityDoYouWantToWorkPhrase";
    self.getNewCityDoYouWantToWorkFileId = function (){
        return self._newCityDoYouWantToWorkFileId;
    }

    self._newCityRecallAboutWorkFileId = "NewCityRecallAboutWorkPhrase";
    self.getNewCityRecallAboutWorkFileId = function (){
        return self._newCityRecallAboutWorkFileId;
    }

    self._newCityGoodbyeFileId = "NewCityGoodbyePhrase";
    self.getNewCityGoodbyeFileId = function (){
        return self._newCityGoodbyeFileId;
    }

    self._helloPatientFileId = "HelloPatient";
    self.getHelloPatientFileId = function (){
        return self._helloPatientFileId;
    }

    self._recordQueryFileId = "RecordQuery";
    self.getRecordQueryFileId = function (){
        return self._recordQueryFileId;
    }

    self._googbyeFileId = "GoogbyePhrase";
    self.getGoogbyeFileId = function (){
        return self._googbyeFileId;
    }

    self._recallFileId = "RecallPhrase";
    self.getRecallFileId = function (){
        return self._recallFileId;
    }

    self._notRealizedFeatureFileId = "NotRealizedFeaturePhrase";
    self.getNotRealizedFeatureFileId = function (){
        return self._notRealizedFeatureFileId;
    }

    self._doctorInfoFileId = "DoctorInfoPhrase";
    self.getDoctorInfoFileId = function (){
        return self._doctorInfoFileId;
    }

    self._connectingPatientAndDoctorFileId = "ConnectingPatientAndDoctorPhrase";
    self.getConnectingPatientAndDoctorFileId = function (){
        return self._connectingPatientAndDoctorFileId;
    }

    self._doctorAnsweredFileId = "DoctorAnsweredPhrase";
    self.getDoctorAnsweredFileId = function (){
        return self._doctorAnsweredFileId;
    }

    self._doctorNotAnsweredFileId = "DoctorNotAnsweredPhrase";
    self.getDoctorNotAnsweredFileId = function (){
        return self._doctorNotAnsweredFileId;
    }

    self._recordInfoFileId = "RecordInfoPhrase";
    self.getRecordInfoFileId = function (){
        return self._recordInfoFileId;
    }

    self._recordDateFileId = "RecordDatePhrase";
    self.getRecordDateFileId = function (){
        return self._recordDateFileId;
    }

    self._recordTimeFileId = "RecordTimePhrase";
    self.getRecordTimeFileId = function (){
        return self._recordTimeFileId;
    }

    self._recordCancelQueryFileId = "RecordCancelQuery";
    self.getRecordCancelQueryFileId = function (){
        return self._recordCancelQueryFileId;
    }

    self._recordCancelRepeatQueryFileId = "RecordCancelRepeatQuery";
    self.getRecordCancelRepeatQueryFileId = function (){
        return self._recordCancelRepeatQueryFileId;
    }

    self._recordCancelledPhraseId = "RecordCancelledPhrase";
    self.getRecordCancelledPhraseId = function (){
        return self._recordCancelledPhraseId;
    }

    self._happyToHelpPhraseId = "HappyToHelpPhrase";
    self.getHappyToHelpFileId = function (){
        return self._happyToHelpPhraseId;
    }

    self._outCallHelloPatientFileId = "OutCallHelloPatientPhrase";
    self.getOutCallHelloPatientFileId = function (){
        return self._outCallHelloPatientFileId;
    }

    self._recordDraftFileId = "RecordDraftPhrase";
    self.getRecordDraftFileId = function (){
        return self._recordDraftFileId;
    }

    self._freeRecordDateFileId = "FreeRecordDatePhrase";
    self.getFreeRecordDateFileId = function (){
        return self._freeRecordDateFileId;
    }

    self._freeRecordTimeFileId = "FreeRecordTimePhrase";
    self.getFreeRecordTimeFileId = function (){
        return self._freeRecordTimeFileId;
    }

    self._dateFileId = "DatePhrase";
    self.getDateFileId = function (){
        return self._dateFileId;
    }

    self._freeRecordRelativeTimeFileId = "FreeRecordRelativeTimeFileId";
    self.getFreeRecordRelativeTimeFileId = function (){
        return self._freeRecordRelativeTimeFileId;
    }

    self._willYouComeFileId = "WillYouComeFileId";
    self.getWillYouComeFileId = function (){
        return self._willYouComeFileId;
    }

    self._repeatWillYouComeFileId = "RepeatWillYouComeFileId";
    self.getRepeatWillYouComeFileId = function (){
        return self._repeatWillYouComeFileId;
    }

    self._noFreeRecordFileId = "NoFreeRecordFileId";
    self.getNoFreeRecordFileId = function (){
        return self._noFreeRecordFileId;
    }

    self._getRandomInt = function( min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


module.exports = {};

module.exports.extend = function (dest, options) {
  mixins.call(dest, options);
}
