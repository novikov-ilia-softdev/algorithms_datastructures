module.exports = QueueService;

var amqp = require('amqplib/callback_api');

function QueueService(scenario, settings) {
    var self = this;

    self.scenario = scenario;

    var url = 'amqp://' + settings.services.queue.login + ':' + settings.services.queue.password +
        '@' + settings.services.queue.host + ':' + settings.services.queue.port;

    if(settings.services.queue.vhost != '/') {
        url += settings.services.queue.vhost;
    }

    var channel = null,
        isInit = false;

    self.init = function(callback){
        if(isInit) {
            return callback(null);
        }
        
        amqp.connect(url, function(err, connection){
            if(err) {
                return callback(err);
            }
            connection.createChannel(function(err, ch){
                if(err) {
                    return callback(err);
                }
                channel = ch;
                isInit = true;
                callback(null);
            });
        });
    };

    self.handle = function( exchange, routing_key, callback){
        channel.assertExchange(exchange, 'direct', {durable: true});
        channel.assertQueue('', {exclusive: true}, function(err, q) {
            channel.bindQueue(q.queue, exchange, routing_key);
            channel.consume(q.queue, function(msg) {
                callback(msg.content.toString());
            }, {noAck: true});
        });
    };
}