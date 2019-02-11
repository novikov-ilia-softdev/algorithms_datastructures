module.exports = Scale;

var assert = require( "assert");

var extend = require( '../util/extend');
var Widget = require( './widget');
var WidgetDescriptor = require( './widgetdescriptor');

var SCALE_TYPE = "ScaleType";
var CP_SCALE_INPUT_DATA_EVENT = "ScaleInputEvent";

extend( Scale, Widget);

function Scale( widgetManager, title, min, max, step, current){
    var self = this;

    var data = {
        "MinValue": min,
        "MaxValue": max,
        "CurrentValue": current,
        "Step": step
    };

    self.descriptor = new WidgetDescriptor( title, SCALE_TYPE, data);

    self.getInput = function( callback){
        self.on( CP_SCALE_INPUT_DATA_EVENT + "_" + self.descriptor.id, function handler( event){
            if( event.id == CP_SCALE_INPUT_DATA_EVENT){
                var eventData = null;
                try{
                    eventData = JSON.parse( event.data);
                } catch( err){
                    console.log( "Scale.getInput() error: ", err);
                    return;
                }

                if( eventData.error == null || eventData.error == 0){
                    self.descriptor.data.CurrentValue = eventData.value;

                    self.removeAllListeners( "close_" + self.descriptor.id);

                    self.close( function(){
                        callback( eventData ? eventData.value : null);
                    });
                }
                else{
                    terminal_utils.errorDialog( widgetManager, "Ошибка", "Введены неверные данные", null, false);
                }
            }
        });
    };

    self.setValue = function( value) {
        self.descriptor.CurrentValue = value;
    }
}