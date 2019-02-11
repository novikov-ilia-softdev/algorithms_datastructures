var PATH_AUDIOFILE = '/var/voxi/audio_dict';
var PATH_NUMBER = PATH_AUDIOFILE + '/number/';

module.exports = AudioFilesMapCreator;
var loki = require( 'lokijs');
var fs = require( 'fs');

function AudioFilesMapCreator(){
    var self = this;

    self.createAudioFilesMap = function( dbpath, dbname){
        var db = new loki( dbpath+'/'+dbname, {autoload:true, autoloadCallback:function( err,db) {
            if (err)
            console.log("Error create DB" +err);
            else
            return db;
            }
        });

        var numbers = db.addCollection( 'number');
        numbers.insert({ id: 'number_1', path:PATH_NUMBER + 'number_1.wav'});
        numbers.insert({ id: 'number_2', path:PATH_NUMBER  + 'number_2.wav'});
        numbers.insert({ id: 'number_3', path:PATH_NUMBER  + 'number_3.wav'});
        numbers.insert({ id: 'number_4', path:PATH_NUMBER  + 'number_4.wav'});
        numbers.insert({ id: 'number_5', path:PATH_NUMBER  + 'number_5.wav'});
        numbers.insert({ id: 'number_6', path:PATH_NUMBER  + 'number_6.wav'});
        numbers.insert({ id: 'number_7', path:PATH_NUMBER  + 'number_7.wav'});
        numbers.insert({ id: 'number_8', path:PATH_NUMBER  + 'number_8.wav'});
        numbers.insert({ id: 'number_9', path:PATH_NUMBER  + 'number_9.wav'});
        numbers.insert({ id: 'number_10', path:PATH_NUMBER  + 'number_10.wav'});
        numbers.insert({ id: 'number_11', path:PATH_NUMBER  + 'number_11.wav'});
        numbers.insert({ id: 'number_12', path:PATH_NUMBER  + 'number_12.wav'});
        numbers.insert({ id: 'number_13', path:PATH_NUMBER  + 'number_13.wav'});
        numbers.insert({ id: 'number_14', path:PATH_NUMBER  + 'number_14.wav'});
        numbers.insert({ id: 'number_15', path:PATH_NUMBER  + 'number_15.wav'});
        numbers.insert({ id: 'number_16', path:PATH_NUMBER  + 'number_16.wav'});
        numbers.insert({ id: 'number_17', path:PATH_NUMBER  + 'number_17.wav'});
        numbers.insert({ id: 'number_18', path:PATH_NUMBER  + 'number_18.wav'});
        numbers.insert({ id: 'number_19', path:PATH_NUMBER  + 'number_19.wav'});
        numbers.insert({ id: 'number_20', path:PATH_NUMBER  + 'number_20.wav'});
        numbers.insert({ id: 'number_30', path:PATH_NUMBER  + 'number_30.wav'});
        numbers.insert({ id: 'number_40', path:PATH_NUMBER  + 'number_40.wav'});
        numbers.insert({ id: 'number_50', path:PATH_NUMBER  + 'number_50.wav'});
        numbers.insert({ id: 'number_60', path:PATH_NUMBER  + 'number_60.wav'});
        numbers.insert({ id: 'number_70', path:PATH_NUMBER  + 'number_70.wav'});
        numbers.insert({ id: 'number_80', path:PATH_NUMBER  + 'number_80.wav'});
        numbers.insert({ id: 'number_90', path:PATH_NUMBER  + 'number_90.wav'});
        numbers.insert({ id: 'number_100', path:PATH_NUMBER + 'number_100.wav'});
        numbers.insert({ id: 'number_200', path:PATH_NUMBER + 'number_200.wav'});
        numbers.insert({ id: 'number_300', path:PATH_NUMBER + 'number_300.wav'});
        numbers.insert({ id: 'number_400', path:PATH_NUMBER + 'number_400.wav'});
        numbers.insert({ id: 'number_500', path:PATH_NUMBER + 'number_500.wav'});
        numbers.insert({ id: 'number_600', path:PATH_NUMBER + 'number_600.wav'});
        numbers.insert({ id: 'number_700', path:PATH_NUMBER + 'number_700.wav'});
        numbers.insert({ id: 'number_800', path:PATH_NUMBER + 'number_800.wav'});
        numbers.insert({ id: 'number_900', path:PATH_NUMBER + 'number_900.wav'});
        numbers.insert({ id: 'number_1000_i_plural',path:PATH_NUMBER + 'number_1000_i_plural.wav'});
        numbers.insert({ id: 'number_1000_i_singular',path:PATH_NUMBER + 'number_1000_i_singular.wav'});
        numbers.insert({ id: 'number_1000_r',path:PATH_NUMBER + 'number_1000_r.wav'});
        numbers.insert({ id: 'number_1_f',path:PATH_NUMBER + 'number_1_f.wav'});
        numbers.insert({ id: 'number_2_f',path:PATH_NUMBER + 'number_2_f.wav'});

//        console.log( numbers.data);

        var km = db.addCollection( 'km');
        km.insert({ id: 'km_i', path:PATH_AUDIOFILE + '/km/' + 'km_i.wav'});
        km.insert({ id: 'km_r_singular', path:PATH_AUDIOFILE + '/km/' + 'km_r_singular.wav'});
        km.insert({ id: 'km_r_plural', path:PATH_AUDIOFILE + '/km/' + 'km_r_plural.wav'});

        var meters = db.addCollection( 'meter');
        meters.insert({ id: 'meter_r_singular', path:PATH_AUDIOFILE + '/meter/' + 'meter_r_singular.wav'});
        meters.insert({ id: 'meter_i', path:PATH_AUDIOFILE + '/meters/' + 'meter_i.wav'});
        meters.insert({ id: 'meter_r_plural', path:PATH_AUDIOFILE + '/meter/' + 'meter_r_plural.wav'});

//        console.log( meters.data);
        var rubles = db.addCollection( 'ruble');
        rubles.insert({ id: 'ruble_i', path:PATH_AUDIOFILE + '/ruble/' + 'rubl_i.wav'});
        rubles.insert({ id: 'ruble_r_plural', path:PATH_AUDIOFILE + '/ruble/' + 'rubl_r_plural.wav'});
        rubles.insert({ id: 'ruble_r_singular', path:PATH_AUDIOFILE + '/ruble/' + 'rubl_r_singular.wav'});
//        console.log( rubles.data);

        var hours = db.addCollection( 'hour');
        hours.insert({ id: 'hour_i', path:PATH_AUDIOFILE + '/hour/' + 'hour_i.wav'});
        hours.insert({ id: 'hour_r_singular', path:PATH_AUDIOFILE + '/hour/' + 'hour_r_singular.wav'});
        hours.insert({ id: 'hour_r_plural', path:PATH_AUDIOFILE + '/hour/' + 'hour_r_plural.wav'});
//        console.log( hours.data);


        var minutes = db.addCollection( 'minute');
        minutes.insert({ id: 'minute_r_plural', path:PATH_AUDIOFILE + '/minute/' + 'minutes_r_plural.wav'});
        minutes.insert({ id: 'minute_i_plural', path:PATH_AUDIOFILE + '/minute/' + 'minutes_i_plural.wav'});
        minutes.insert({ id: 'minute_i', path:PATH_AUDIOFILE + '/minute/' + 'minutes_i.wav'});
//        console.log( minutes.data);

        var prepositions = db.addCollection( 'preposition');
        prepositions.insert({ id: 'preposition_for', path:PATH_AUDIOFILE + '/preposition/' + 'for.wav'});
        prepositions.insert({ id: 'preposition_these', path:PATH_AUDIOFILE + '/preposition/' + 'these.wav'});
        prepositions.insert({ id: 'preposition_this', path:PATH_AUDIOFILE + '/preposition/' + 'this.wav'});
//        console.log( prepositions.data);

        var dialog1 = db.addCollection( 'dialog1');
        dialog1.insert({ id: 'dialog1_1', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_1.wav'});
        dialog1.insert({ id: 'dialog1_2', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_2.wav'});
        dialog1.insert({ id: 'dialog1_3', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_3.wav'});
        dialog1.insert({ id: 'dialog1_4_part1', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_4_part1.wav'});
        dialog1.insert({ id: 'dialog1_4_part2', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_4_part2.wav'});
        dialog1.insert({ id: 'dialog1_4_part3', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_4_part3.wav'});
        dialog1.insert({ id: 'dialog1_4_part4', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_4_part4.wav'});
        dialog1.insert({ id: 'dialog1_5_part1', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_5_part1.wav'});
        dialog1.insert({ id: 'dialog1_5_part2', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_5_part2.wav'});
        dialog1.insert({ id: 'dialog1_6', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_6.wav'});
        dialog1.insert({ id: 'dialog1_7_part1', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_7_part1.wav'});
        dialog1.insert({ id: 'dialog1_7_part2', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_7_part2.wav'});
        dialog1.insert({ id: 'dialog1_7_part3', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_7_part3.wav'});
        dialog1.insert({ id: 'dialog1_8_part1', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_8_part1.wav'});
        dialog1.insert({ id: 'dialog1_8_part2', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_8_part2.wav'});
        dialog1.insert({ id: 'dialog1_8_part3', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_8_part3.wav'});
        dialog1.insert({ id: 'dialog1_8_part4', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_8_part4.wav'});
        dialog1.insert({ id: 'dialog1_8_part5', path:PATH_AUDIOFILE + '/dialog1/' + 'dialog1_8_part5.wav'});
//        console.log( dialog1.data);


        var rectification = db.addCollection( 'rectification');
        rectification.insert({ id: 'rectification_1', path:PATH_AUDIOFILE + '/rectification/' + 'rectification_1.wav'});
        rectification.insert({ id: 'rectification_2', path:PATH_AUDIOFILE + '/rectification/' + 'rectification_2.wav'});
        rectification.insert({ id: 'rectification_3', path:PATH_AUDIOFILE + '/rectification/' + 'rectification_3.wav'});
        rectification.insert({ id: 'rectification_4', path:PATH_AUDIOFILE + '/rectification/' + 'rectification_4.wav'});
        rectification.insert({ id: 'rectification_5', path:PATH_AUDIOFILE + '/rectification/' + 'rectification_5.wav'});
        rectification.insert({ id: 'rectification_6', path:PATH_AUDIOFILE + '/rectification/' + 'rectification_6.wav'});

        //       console.log( rectification.data);

        var dialog2 = db.addCollection( 'dialog2');
        dialog2.insert({ id: 'dialog2_1_part1', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_1_part1.wav'});
        dialog2.insert({ id: 'dialog2_1_part2', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_1_part2.wav'});
        dialog2.insert({ id: 'dialog2_2', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_2.wav'});
        dialog2.insert({ id: 'dialog2_3', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_3.wav'});
        dialog2.insert({ id: 'dialog2_4', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_4.wav'});
        dialog2.insert({ id: 'dialog2_5', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_5.wav'});
        dialog2.insert({ id: 'dialog2_6', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_6.wav'});
        dialog2.insert({ id: 'dialog2_7_part1', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_7_part1.wav'});
        dialog2.insert({ id: 'dialog2_7_part2', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_7_part2.wav'});
        dialog2.insert({ id: 'dialog2_7_part3', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_7_part3.wav'});
        dialog2.insert({ id: 'dialog2_7_part4', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_7_part4.wav'});
        dialog2.insert({ id: 'dialog2_8_part1', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_8_part1.wav'});
        dialog2.insert({ id: 'dialog2_8_part2', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_8_part2.wav'});
        dialog2.insert({ id: 'dialog2_8_part3', path:PATH_AUDIOFILE + '/dialog2/' + 'dialog2_8_part3.wav'});
 //       console.log( dialog2.data);

        var dialog3 = db.addCollection( 'dialog3');
        dialog3.insert({ id: 'dialog3_1', path:PATH_AUDIOFILE + '/dialog3/' + 'dialog3_1.wav'});
        dialog3.insert({ id: 'dialog3_2', path:PATH_AUDIOFILE + '/dialog3/' + 'dialog3_2.wav'});
        dialog3.insert({ id: 'dialog3_3', path:PATH_AUDIOFILE + '/dialog3/' + 'dialog3_3.wav'});
        dialog3.insert({ id: 'dialog3_4', path:PATH_AUDIOFILE + '/dialog3/' + 'dialog3_4.wav'});
        dialog3.insert({ id: 'dialog3_5', path:PATH_AUDIOFILE + '/dialog3/' + 'dialog3_5.wav'});
        dialog3.insert({ id: 'dialog3_6', path:PATH_AUDIOFILE + '/dialog3/' + 'dialog3_6.wav'});
        dialog3.insert({ id: 'dialog3_7', path:PATH_AUDIOFILE + '/dialog3/' + 'dialog3_7.wav'});
        dialog3.insert({ id: 'dialog3_8', path:PATH_AUDIOFILE + '/dialog3/' + 'dialog3_8.wav'});

 //       console.log( dialog3.data);

        var notification = db.addCollection( 'notification');
        notification.insert({ id: 'notification_no_driver', path:PATH_AUDIOFILE + '/notification/' + 'no_driver.wav'});
        notification.insert({ id: 'notification_waiting', path:PATH_AUDIOFILE + '/notification/' + 'waiting.wav'});

        db.saveDatabase( function( err, res) {
               if( err)
                console.log("Error saveDatabase");
               else
               {
                   db.close( function (err, res) {
                       if( err)
                           console. log ("Error closeDatabase");

                      });

               }


        });


    };

}






