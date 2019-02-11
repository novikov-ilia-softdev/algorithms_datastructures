module.exports = MapStore;

var loki = require( 'lokijs');

function MapStore() {
    var self = this;

    self.collectionName = "base_collection";

    self.load = function( mapFile, callback) {
        self.db = new loki( mapFile, {autoload:true, autoloadCallback: callback});
    };

    self.get = function( key) {
        var col = self.db.getCollection( self.collectionName);
        if(!col)
            return null;

        var valueCollection = col.find({'key': key});

        return valueCollection.length? valueCollection[0].value: null;
    };

    self.set = function( key, value) {

        var col = self.db.getCollection( self.collectionName);

        if( !col)
            col = self.db.addCollection( self.collectionName);

        col.insert({key:key, value: value});
        self.db.saveDatabase( function(err){
            if( err) console.log("Store Map error", err);
        })
    };
}