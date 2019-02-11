var assert = require( "assert");

describe( 'Control Cacher Test', function(){
	try{
		var wgdb = require( 'wgdb');
	}
	catch( e){
		console.warn( e);
		return;
	}
	var ControlCacher = require( '../lib/control/controlcacher');

	var conf = {
		"enable":"yes",
		"name":"1111",
		"size":"1000000"
	};
	var controlCacher = null;

	beforeEach( function( done){
		controlCacher = new ControlCacher();
		controlCacher.init( conf, function (err) {
			done(err);
		});
	});
	
	afterEach( function(){
		controlCacher.cache.db.delete();
		controlCacher.destroy();
		controlCacher = null;
	});

	it( 'should cache attrubute', function( done){
		
		var controlObjectName = "controlObjectName";
		var attributeName = "attributeName";
		var attributeValue = "attributeValue";

		controlCacher.cacheAttribute( controlObjectName, attributeName, attributeValue, function( err){
			if( err) done(err);
			controlCacher.getCachedAttribute( controlObjectName, attributeName, function( err, res){
				if( err) done(err);
				assert.equal( res, attributeValue);
				done();
			});
		});
	});

	it( 'should not cache attrubute if caching disabled', function( done){

		var conf = {
			"enable":"no",
			"name":"11111",
			"size":"1000000"
		};

		var controlCacher1 = new ControlCacher();
		controlCacher1.init( conf, function (err) {
			if( err) done(err);
		});
		var controlObjectName = "controlObjectName";
		var attributeName = "attributeName";
		var attributeValue = "attributeValue";

		controlCacher1.cacheAttribute( controlObjectName, attributeName, attributeValue, function( err){
			if( err) done(err);
			controlCacher1.getCachedAttribute( controlObjectName, attributeName, function( err, res){
				if( err) done(err);
				assert.equal( res, null);
				controlCacher1.cache.db.delete();
				controlCacher1.destroy();
				done()
			});
		});
	});
});