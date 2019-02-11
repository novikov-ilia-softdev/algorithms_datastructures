var assert = require( "assert");

describe( 'Cache Test', function(){
	try{
		var wgdb = require( 'wgdb');
	}
	catch( e){
		console.warn( e);
		return;
	}
	var Cache = require( '../lib/cache/cache');

	var conf = {
		name: 1111,
		size: 1000000
	};
	var cache = null;

	beforeEach( function( done){
		cache = new Cache();
		cache.init( conf, function (err) {
			done(err);
		});
	});
	
	afterEach( function(){
		cache.db.delete();
		cache.destroy();
		cache = null;
	});

	it( 'should put and get', function( done){
		
		var key = "key1";
		var value = "value1";

		cache.put( key, value, function( err){
			if( err) done(err);
			cache.get( key, function( err, res){
				if( err) done(err);
				assert.equal( res, value);
				done()
			});
		});
	});

	it( 'should put and get numeric 0', function( done){

		var key = "key1";
		var value = 0;

		cache.put( key, value, function( err){
			if( err) done(err);
			cache.get( key, function( err, res){
				if( err) done(err);
				assert.equal( res, value);
				done()
			});
		});
	});

	it( 'should double put and get', function( done){

		var key = "key1";
		var value1 = "value1";
		var value2 = "value2";

		cache.put( key, value1, function( err){
			if( err) done(err);
			cache.put( key, value2, function( err){
				if( err) done(err);
				cache.get( key, function( err, res){
					if( err) done(err);
					assert.equal( res, value2);
					done()
				});
			});
		});
	});

	it( 'should del', function( done){

		var key = "key1";
		var value = "value1";

		cache.put( key, value, function( err){
			if( err) done(err);
			cache.del( key, function( err){
				if( err) done(err);
				cache.get( key, function( err, res){
					if( err) done(err);
					assert.equal( res, null);
					done()
				});
			});
		});
	});

	it( 'should del and then put and get', function( done){

		var key = "key1";
		var value = "value1";

		cache.put( key, value, function( err){
			if( err) done(err);
			cache.del( key, function( err){
				if( err) done(err);
				cache.get( key, function( err, res){
					if( err) done(err);
					assert.equal( res, null);
					cache.put( key, value, function( err){
						if( err) done(err);
						cache.get( key, function( err, res){
							if( err) done(err);
							assert.equal( res, value);
							done()
						});
					});
				});
			});
		});
	});
});