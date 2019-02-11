module.exports = AudioFilesMap;

var loki = require( 'lokijs');

function AudioFilesMap() {
    var self = this;

    self.loadDatabase = function( dbFile, callback) {
        self.db = new loki( dbFile, {autoload:true, autoloadCallback: callback});
    };

    self.getAudioFilePath = function (key) {
        var i = key.indexOf('_');
        if((i ==-1)||(i == 0))
            return null;
        var id = key.substring(0, i);

        var col = self.getCollection(id);
        if(!col)
            return null;

        var path = col.find({'id': key});
        if(path.length == 0)
            return null;

        return path[0].path;
    };

    self.getCollection = function ( key) {
        var col = self.db.getCollection( key);
        if( !col)
            return null;
        return col;

    };
}