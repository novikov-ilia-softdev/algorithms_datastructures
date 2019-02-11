var inflect = require( 'rus_inflect');

module.exports.completeTime = function( incompletePhrase, time) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{time}") != -1){
        var hours = Math.floor(time/60);
        var days = Math.floor(hours/24);

        var minutes = time - hours*60;
        hours -= days*24;

        var phrase_completer = "";

        if( days){
            if( days > 1)
                phrase_completer += days+ " ";
            phrase_completer += inflect( "д", days, ["ней","ень","ня"]);
        }

        if( hours){
            if( days)
                phrase_completer += " ";
            if( hours > 1 || days)
                phrase_completer += hours+ " ";
            phrase_completer += inflect( "час", hours, ["ов","","а"]);
        }

        if( minutes){
            if( days || hours)
                phrase_completer += " ";
            phrase_completer += minutes+ " "+inflect( "минут", minutes, ["","а","ы"]);
        }

        phrase = phrase.replace( "{time}", phrase_completer);
    }

    return phrase;
}

module.exports.completePrice = function( incompletePhrase, price) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{price}") != -1){
        if (price > 0) phrase = phrase.replace( "{price}", Math.round(price)+ " "+inflect( "рубл", Math.round(price), ["ей","ь","я"]));
        else phrase = phrase.replace( "{price}", "до говорная");
    }
    return phrase;
}

module.exports.completeDistance = function( incompletePhrase, distance) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{distance}") != -1){
        var distance_km = Math.floor( distance);
        var distance_m = Math.round((distance - distance_km)*1000);

        var distance_phrase = "";
        if( distance_km)
            distance_phrase += distance_km+ " "+inflect( "километр", distance_km, ["ов","","а"]);

        if( distance_m){
            if( distance_km)
                distance_phrase += " ";
            distance_phrase += distance_m+ " "+inflect( "метр", distance_m, ["ов","","а"]);
        }

        phrase = phrase.replace( "{distance}", distance_phrase);
    }
    return phrase;
}

module.exports.completeDistanceShort = function( incompletePhrase, distance) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{distance}") != -1){
        var distance_phrase = "";
        if( distance < 1)
            distance_phrase = "меньше километра";
        else if( distance){
            distance_phrase = Math.round( distance)+ " "+inflect( "километр", Math.round( distance), ["ов","","а"]);
        }

        phrase = phrase.replace( "{distance}", distance_phrase);
    }
    return phrase;
}

module.exports.completeTimeShort = function( incompletePhrase, time) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{time}") != -1){
        var hours = Math.floor(time/60);
        var days = Math.floor(hours/24);

        var minutes = time - hours*60;
        if( time < 5)
            minutes = 5;
        hours -= days*24;

        var phrase_completer = "";

        if( days){
            if( days > 1)
                phrase_completer += days+ " ";
            phrase_completer += inflect( "д", days, ["ней","ень","ня"]);
        }

        if( hours){
            if( days)
                phrase_completer += " ";
            if( hours > 1 || days)
                phrase_completer += hours+ " ";
            phrase_completer += inflect( "час", hours, ["ов","","а"]);
        }

        if( !days && !hours && minutes){
            var roundTo = 5;
            var remainder = minutes % roundTo;
            var quotient = Math.floor( minutes / roundTo);

            minutes = roundTo*quotient;
            minutes += (remainder>roundTo/2)?roundTo:0;
            phrase_completer += minutes+ " "+inflect( "минут", minutes, ["","а","ы"]);
        }

        phrase = phrase.replace( "{time}", phrase_completer);
    }

    return phrase;
}

module.exports.completeName = function( incompletePhrase, name) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{name}") != -1){
        phrase = phrase.replace( "{name}", name);
    }
    return phrase;
}

module.exports.completeCarNumber = function( incompletePhrase, car_number) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{car_number}") != -1){
        phrase = phrase.replace( "{car_number}", car_number);
    }
    return phrase;
}

module.exports.completeCount = function( incompletePhrase, count) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{count}") != -1){
        phrase = phrase.replace( "{count}", count);
    }
    return phrase;
}

module.exports.completeCarColor = function( incompletePhrase, car_color) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{car_color}") != -1){
        phrase = phrase.replace( "{car_color}", car_color);
    }
    return phrase;
}

module.exports.completeDate = function( incompletePhrase, date) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{date}") != -1){
        phrase = phrase.replace( "{date}", date);
    }
    return phrase;
}

module.exports.completeDiscountNames = function( incompletePhrase, discounts) {
    var phrase = incompletePhrase;
    if( phrase.indexOf( "{discount_names}") != -1){
        var discount_names = [];
        for (var discount of discounts)
        {
            discount_names.push(discount.description);
        }

        phrase = phrase.replace( "{discount_names}", discount_names.join(', '));
    }
    return phrase;
}

module.exports.complete = function( incompletePhrase, data){

    var phrase = incompletePhrase;
    if( data){

        phrase = exports.completeDate( phrase, data.date);
        phrase = exports.completeTime( phrase, data.time);
        phrase = exports.completeDistance( phrase, data.distance);
        phrase = exports.completePrice( phrase, data.price);
        phrase = exports.completeName( phrase, data.name);
        phrase = exports.completeCarNumber( phrase, data.car_number);
        phrase = exports.completeCarColor( phrase, data.car_color);
        phrase = exports.completeDiscountNames( phrase, data.discounts);
        phrase = exports.completeCount( phrase, data.count);
    }
    return phrase;
}

module.exports.completeShort = function( incompletePhrase, data){

    var phrase = incompletePhrase;
    if( data){

        phrase = exports.completeDate( phrase, data.date);
        phrase = exports.completeTimeShort( phrase, data.time);
        phrase = exports.completeDistanceShort( phrase, data.distance);
        phrase = exports.completePrice( phrase, data.price);
        phrase = exports.completeName( phrase, data.name);
        phrase = exports.completeCarNumber( phrase, data.car_number);
        phrase = exports.completeCarColor( phrase, data.car_color);
        phrase = exports.completeDiscountNames( phrase, data.discounts);
        phrase = exports.completeCount( phrase, data.count);
    }
    return phrase;
}