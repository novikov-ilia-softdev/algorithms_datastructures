

var DISTANCE_CATEGORY = "distance";
var PRICE_CATEGORY = "price";
var TIME_CATEGORY = "time";
var NAME_CATEGORY = "name";
var SPONSOR_CATEGORY = "sponsor";
var DATA_CATEGORY = "data_category";

var HUNDRED_THOUSANDS_NUMBER = "hundred_thousands";
var DECADE_THOUSANDS_NUMBER = "decade_thousands";
var THOUSANDS_NUMBER = "thousands";
var HUNDREDS_NUMBER = "hundreds";
var DECADES_NUMBER = "decades";
var SECOND_DECADE_NUMBER = "second_decade";
var ONE_NUMBER = "one";
var HUNDRED = 100;
var DECADE = 10;

var THOUSAND_KILOMETERS = "thousand_kilometers";
var KILOMETERS = "kilometer";
var METERS = "meter";
var LESS_ZERO = "less_zero";

var THOUSAND_RUBLES = "thousand_rubles";
var RUBLES = "rubles";

var DECADE_HOURS = "decade_hours";
var HOURS = "hours";
var MINUTES = "minutes";


module.exports = IdConverter;
function IdConverter(){


    var self = this;
    self.init = false;

    self.init = function() {

        var settings = require('../settings/settings');
        self.phraseList = require( settings.tts.phraseListFile);
        if( self.phraseList)
            self.init = true;

    };

    self.getIdList = function( phraseId, data, callback){

        var idList = [];

        if( self.init == true)
        {
            var phrase = self.phraseList[phraseId];

            for( var j = 0; j < phrase.descriptor.idList.length; j++)
            {
                if( phrase.descriptor.idList[j].hasOwnProperty( DATA_CATEGORY))
                {
                    if( !data) throw new Error("No data!!!!");
                    var dataIdList = self.handleData( phrase.descriptor.idList[j].data_category, data);

                    for( var dataNumber = 0; dataNumber < dataIdList.length; dataNumber++)
                        idList.push( dataIdList[dataNumber]);
                }
                else
                    idList.push( phrase.descriptor.idList[j]);
            }

            callback( null, idList);
        } else {
            callback("Is not init!!!!", idList);
        }
    };

    self.handleData = function(category, data){
        var idList = [];
        if( category == DISTANCE_CATEGORY){
            if( !data.hasOwnProperty( DISTANCE_CATEGORY)) throw new Error( "Data has not distance!!!!");
            else {
                var distance = data.distance;
                return self.handleDistance( distance);
            }
        }
        else if( category == PRICE_CATEGORY){
            if( !data.hasOwnProperty( PRICE_CATEGORY)) throw new Error( "Data has not price!!!!");
            else {
                var price = data.price;
                return self.handlePrice( price);
            }
        }
        else if( category == TIME_CATEGORY){
            if( !data.hasOwnProperty( TIME_CATEGORY)) throw new Error( "Data has not time!!!!");
            else {
                var time = data.time;
                return self.handleTime( time);
            }
        }
        return idList;
    };

    self.handleTime = function( time){
        var idList = [];

        if( time >= 600 && time < 1000)
            return self.handleNumbersWithCategory( time, HUNDREDS_NUMBER, DECADE_HOURS);
        if( time >= 100 && time < 600)
            return self.handleNumbersWithCategory( time, HUNDREDS_NUMBER, HOURS);
        if( time >= 60 && time < 100)
            return self.handleNumbersWithCategory( time, DECADES_NUMBER, HOURS);
        if( time >= 10 && time < 60)
            return self.handleNumbersWithCategory( time, DECADES_NUMBER, MINUTES);
        if( time >= 1 && time < 10)
            return self.handleNumbersWithCategory( time, ONE_NUMBER, MINUTES);
        return idList;
    };

    self.handlePrice = function( price){
        var idList = [];

        if( price >= 100000)
            return self.handleNumbersWithCategory( price, HUNDRED_THOUSANDS_NUMBER, THOUSAND_RUBLES);
        if( price >= 10000)
            return self.handleNumbersWithCategory( price, DECADE_THOUSANDS_NUMBER, THOUSAND_RUBLES);
        if( price >= 1000)
            return self.handleNumbersWithCategory( price, THOUSANDS_NUMBER, THOUSAND_RUBLES);
        if( price >= 100)
            return self.handleNumbersWithCategory( price, HUNDREDS_NUMBER, RUBLES);
        if( price >= 10)
            return self.handleNumbersWithCategory( price, DECADES_NUMBER, RUBLES);
        if( price >= 1)
            return self.handleNumbersWithCategory( price, ONE_NUMBER, RUBLES);

        return idList;
    };

    self.handleDistance = function( distance){
       var idList = [];


        if( distance >= 100000)
            return self.handleNumbersWithCategory( distance, HUNDRED_THOUSANDS_NUMBER, THOUSAND_KILOMETERS);
        if( distance >= 10000)
            return self.handleNumbersWithCategory( distance, DECADE_THOUSANDS_NUMBER, THOUSAND_KILOMETERS);
        if( distance >= 1000)
            return self.handleNumbersWithCategory( distance, THOUSANDS_NUMBER, THOUSAND_KILOMETERS);
        if( distance >= 100)
            return self.handleNumbersWithCategory( distance, HUNDREDS_NUMBER, KILOMETERS);
        if( distance >= 10)
            return self.handleNumbersWithCategory( distance, DECADES_NUMBER, KILOMETERS);
        if( distance >= 1)
            return self.handleNumbersWithCategory( distance, ONE_NUMBER, KILOMETERS);
        if( distance < 1)
            return self.handleNumbersWithCategory(distance, LESS_ZERO, METERS);

        return idList;
    };

    self.handleNumbersWithCategory = function( originNumber, number_category, unit_category){

        var list = [];

        if( number_category == HUNDRED_THOUSANDS_NUMBER || number_category == DECADE_THOUSANDS_NUMBER || number_category == THOUSANDS_NUMBER)
        {
            if( number_category == DECADE_THOUSANDS_NUMBER)
                originNumber = "0" + originNumber;
            if( number_category == THOUSANDS_NUMBER)
                originNumber = "00" + originNumber;

            var thousands = originNumber.substring(0,3);

            var thousandList = self.handleHundredNumber(thousands);
            list = list.concat( thousandList);

            list.push( self.handleCategory(unit_category, originNumber.substring(1,3)));

            var hundreds = originNumber.substring(3,6);

            var hundredNumberList = self.handleHundredNumber( hundreds);
            list = list.concat( hundredNumberList);

            if( unit_category == THOUSAND_KILOMETERS || unit_category == KILOMETERS)
                list.push( self.handleCategory(KILOMETERS, originNumber.substring(4,6)));
            if( unit_category == THOUSAND_RUBLES || unit_category == RUBLES)
                list.push( self.handleCategory( RUBLES, originNumber.substring(4,6)));

            if( originNumber.length > 6 && originNumber[6] == '.')
            {
                if( unit_category == THOUSAND_KILOMETERS || unit_category == KILOMETERS || unit_category == METERS)
                {
                    if( originNumber.length == 8)
                        originNumber += "00";
                    else if( originNumber.length == 9)
                        originNumber += "0";

                    var meters = originNumber.substring(7);

                    var metersList = self.handleHundredNumber( meters);
                    list = list.concat( metersList);

                    list.push( self.handleCategory(METERS, originNumber.substring(8)));

                }
            }
        }
        if( number_category == HUNDREDS_NUMBER || number_category == DECADES_NUMBER || number_category == ONE_NUMBER)
        {
            if( number_category == DECADES_NUMBER)
                originNumber = "0" + originNumber;
            if( number_category == ONE_NUMBER)
                originNumber = "00" + originNumber;

            var hundredsOnly = originNumber.substring(0,3);

            if( (unit_category == DECADE_HOURS || unit_category == HOURS))
            {
                var hours = ~~(hundredsOnly/60);
                var hours_str;
                if( hours.toString().length == 1)
                    hours_str ="00" + hours;
                else if(hours.toString().length == 2)
                    hours_str ="0" + hours;

                var hoursList = self.handleHundredNumber( hours_str);
                list = list.concat( hoursList);

                list.push( self.handleCategory( HOURS, hours_str.substring(1,3)));

                var minutes = hundredsOnly%60;
                var minutes_str;
                if( minutes.toString().length == 1)
                    minutes_str ="00" + minutes;
                else if( minutes.toString().length == 2)
                    minutes_str ="0" + minutes;
                if( minutes_str > 0)
                {
                    var minmutesList = self.handleHundredNumber( minutes_str);
                    list = list.concat( minmutesList);

                    list.push( self.handleCategory( MINUTES, minutes_str.substring(1,3)));
                }
                return list;
            }
            else
            {
                var hundredMeters = self.handleHundredNumber( hundredsOnly);
                list = list.concat( hundredMeters);
            }
            if( unit_category == KILOMETERS)
                list.push( self.handleCategory(KILOMETERS, originNumber.substring(1,3)));
            if( unit_category == RUBLES)
                list.push( self.handleCategory( RUBLES, originNumber.substring(1,3)));
            if( unit_category == MINUTES)
                list.push( self.handleCategory( MINUTES, originNumber.substring(1,3)));
            if( originNumber.length > 3 && originNumber[3] == '.')
            {
                if( unit_category == KILOMETERS || unit_category == METERS)
                {
                    if( originNumber.length == 5)
                        originNumber += "00";
                    else if( originNumber.length == 6)
                        originNumber += "0";

                    var metersPart = originNumber.substring(4);

                    var meterList = self.handleHundredNumber( metersPart);
                    list = list.concat( meterList);

                    list.push( self.handleCategory(METERS, originNumber.substring(5)));
                }
            }
        }
        if( number_category == LESS_ZERO)
        {
            if( originNumber[0] == 0 && originNumber[1] == '.')
            {
                if( unit_category == METERS)
                {
                    if( originNumber.length == 3)
                        originNumber += "00";
                    else if( originNumber.length == 4)
                        originNumber += "0";

                    var metersOnly = originNumber.substring(2);

                    var metersOnlyList = self.handleHundredNumber( metersOnly);
                    list = list.concat( metersOnlyList);

                    list.push( self.handleCategory(METERS, originNumber.substring(3)));
                }
            }
        }

        return list;

    };

    self.handleHundredNumber = function( hundredNumber){
        var list = [];

        if( hundredNumber[0] > 0)
            list.push( self.handleNumbers( HUNDREDS_NUMBER, hundredNumber[0]));
        if( hundredNumber[1] == 1 && hundredNumber[2] > 0)
        {
            var decades = hundredNumber[1] + hundredNumber[2];
            list.push( self.handleNumbers( SECOND_DECADE_NUMBER, decades));
        }
        if( hundredNumber[1] > 1 || ( hundredNumber[1] == 1 && hundredNumber[2] == 0))
        {
            list.push( self.handleNumbers( DECADES_NUMBER, hundredNumber[1]));
            if( hundredNumber[2] > 0)
                list.push( self.handleNumbers( ONE_NUMBER, hundredNumber[2]));
        }
        if( hundredNumber[1] == 0 && hundredNumber[2] > 0)
            list.push( self.handleNumbers( ONE_NUMBER, hundredNumber[2]));

        return list;

    };

    self.handleCategory = function(unit_category, number){

        if( number[0] == 1 && number[1] > 0)
        {
            if( unit_category == THOUSAND_KILOMETERS || unit_category == THOUSAND_RUBLES)
                return "number_1000_r";
            else if( unit_category == KILOMETERS)
                return "km_r_plural";
            else if(unit_category == METERS)
                return "meter_r_plural";
            else if( unit_category == RUBLES)
                return "ruble_r_plural";
            else if( unit_category == HOURS)
                return "hour_r_plural";
            else if( unit_category == MINUTES)
                return "minute_r_plural";
        }
        else
        {
            if( unit_category == THOUSAND_KILOMETERS || unit_category == THOUSAND_RUBLES)
            {
                if( number[1] == 0 || number[1] > 4)
                    return "number_1000_r";
                if( number[1] == 1)
                    return "number_1000_i_singular";
                if( number[1] > 1 && number[1] < 5)
                    return "number_1000_i_plural";
            }
            else if( unit_category == KILOMETERS)
            {
                if( number[1] == 0 || number[1] > 4)
                    return "km_r_plural";
                if( number[1] == 1)
                    return "km_i";
                if( number[1] > 1 && number[1] < 5)
                    return "km_r_singular";
            }
            else if( unit_category == METERS)
            {
                if( number[1] == 0 || number[1] > 4)
                    return "meter_r_plural";
                if( number[1] == 1)
                    return "meter_i";
                if( number[1] > 1 && number[1] < 5)
                    return "meter_r_singular";
            }
            else if( unit_category == RUBLES)
            {
                if( number[1] == 0 || number[1] > 4)
                    return "ruble_r_plural";
                if( number[1] == 1)
                    return "ruble_i";
                if( number[1] > 1 && number[1] < 5)
                    return "ruble_r_singular";
            }
            else if( unit_category == HOURS)
            {
                if( number[1] == 0 || number[1] > 4)
                    return "hour_r_plural";
                if( number[1] == 1)
                    return "hour_i";
                if( number[1] > 1 && number[1] < 5)
                    return "hour_r_singular";
            }
            else if( unit_category == MINUTES)
            {
                if( number[1] == 0 || number[1] > 4)
                    return "minute_r_plural";
                if( number[1] == 1)
                    return "minute_i";
                if( number[1] > 1 && number[1] < 5)
                    return "minute_i_plural";
            }
        }
    };

    self.handleNumbers = function(number_category, number){
        if( number_category == HUNDREDS_NUMBER)
             return "number_" + (HUNDRED*number);
        if( number_category == DECADES_NUMBER)
            return "number_" + (DECADE*number);
        if( number_category == SECOND_DECADE_NUMBER)
            return "number_" + number;
        if( number_category == ONE_NUMBER)
            return "number_" + number;
    };
}
