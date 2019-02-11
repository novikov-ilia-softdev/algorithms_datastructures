var assert = require( 'assert') 
var child_process = require( 'child_process') 
var fs = require( 'fs') 

var terminalUtils = require( 'terminal_utils') 

var SubjectMock = terminalUtils.SubjectMock 
var Message = require( 'control_serialization_lib').Message 

var channel = require( 'control_lib_js') 
var session = channel.getSession() 
var controlObjectNames = channel.getControlObjectNameHelper().names 

// Attributes
var CP_SHOW_ATTR_NAME = 'ShowWidget'
var CP_CLOSE_ATTR_NAME = 'CloseWidget'
var CP_REPAINT_ATTR_NAME = 'RepaintWidget'

var CP_MENU_ITEM_ACTIVATED_EVENT = "MenuItemActivatedEvent";
var CP_LINEEDIT_INPUT_DATA_EVENT = "LineEditInputEvent";
var CP_CLOSE_WIDGET_EVENT = "CloseWidgetEvent";

var LOGGER_LOG_MESSAGE_ATTR_NAME = 'LogMessage'
var LOGGER_ERROR_MESSAGE_ATTR_NAME = 'ErrorMessage'

var attributes = require( '../src/attribute/attributes');

var converter = require( '../src/utils/converter')

describe( 'SDRSettingsScriptTest', function() {
	var subject = null 
	
	var manifest = JSON.parse( fs.readFileSync( __dirname + '/../manifest.json')) 
	var scriptType = manifest[ 'ScriptType'] 
	
	var scriptId = '123235434562' 
	var scriptCOName = scriptType + '_' + scriptId 
	var scriptRunCommand = 'node ' + __dirname + '/../index.js ' + scriptId 
	
	beforeEach( function( done){
		
		session.start() 
		
		subject = new SubjectMock() 
		subject.start( function( err){
			done( err) 
		})

		cpControlObject = terminalUtils.createControlObject( session, "LocalControlPanelModule", "0", [ CP_SHOW_ATTR_NAME, CP_CLOSE_ATTR_NAME, CP_REPAINT_ATTR_NAME]);
		cpControlObject.init( function( err, res){
			assert.equal( err, null);
		});

		sdr1ControlObject = terminalUtils.createControlObject( session, "SDRModule", "0", [ attributes.sdrMode.name ]);
		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '1');
		sdr1ControlObject.addStringAttribute( attributes.sdrCurrentProfile.name, 'профиль_2');

		var profiles = ["профиль_1", "профиль_2", "профиль_3"]

		sdr1ControlObject.addStringAttribute( attributes.sdrProfileList.name, JSON.stringify( profiles));
		sdr1ControlObject.addStringAttribute( attributes.sdrAddProfile.name);
		sdr1ControlObject.addStringAttribute( attributes.sdrRenameProfile.name);
		sdr1ControlObject.addStringAttribute( attributes.sdrDeleteProfile.name);
		sdr1ControlObject.addStringAttribute( attributes.sdrNumber.name);
		sdr1ControlObject.addStringAttribute( attributes.sdrChannelProfile.name);
		sdr1ControlObject.init( function( err, res){
			assert.equal( err, null);
		});

		sdr2ControlObject = terminalUtils.createControlObject( session, "SDRModule", "1", [ attributes.sdrMode.name ]);
		sdr2ControlObject.addStringAttribute( attributes.sdrMode.name, '1');
		sdr2ControlObject.init( function( err, res){
			assert.equal( err, null);
		});

		pmControlbject = terminalUtils.createControlObject( session, "PowerManagementModule", "0", []);
		pmControlbject.addStringAttribute( attributes.pmSdr1Enabled.name, '0');
		pmControlbject.init( function( err, res){
			assert.equal( err, null);
		});



		logModuleControlObject = terminalUtils.createControlObject( session, "LoggingModule", "0", [ LOGGER_LOG_MESSAGE_ATTR_NAME, LOGGER_ERROR_MESSAGE_ATTR_NAME]);
		logModuleControlObject.init( function( err){
			assert.equal( err, null);
		});

		logModuleControlObject.onAttributeSet( LOGGER_LOG_MESSAGE_ATTR_NAME, function( attribute){
			console.log( "[INFO]: " + attribute.attributeValue);
		});
		logModuleControlObject.onAttributeSet( LOGGER_ERROR_MESSAGE_ATTR_NAME, function( attribute){
			console.log( "[ERROR]: " + attribute.attributeValue);
		});
		
		child_process.exec( scriptRunCommand, function ( error, stdout, stderr){
			console.log( error) 
			console.log( stdout) 
			assert.equal( error, null) 
		}) 
	}) 
	
	afterEach( function( done){
		//setTimeout( function(){
			subject.setAttribute( scriptCOName, '213424', 'Stop', 1, function( res){}) 
		//}, 400)
				
		setTimeout( function(){
			session.stop() 
			subject.stop() 
			done() 
		}, 10)
	})

	it( 'set mode (conventional,scanning,fhss)', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '1');

		var showCounter = 0

		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 2) },

			function( descriptor){
				var expected = { items: [ {name: "* Обычный"}, {name: "  Скан-ие"}, {name: "  ППРЧ"} ]};
				assert.deepEqual( descriptor.data, expected);
				selectMenuItem( descriptor.id, 1) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrMode.name, function( attribute){
			assert.equal( attribute.attributeValue, '2');
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue)
			var expected = { items: [ {name: "  Обычный"}, {name: "* Скан-ие"}, {name: "  ППРЧ"} ]};
			assert.deepEqual( descriptor.data, expected);

			done()
		})
	})

	it( 'conv: set conventional profile', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '1');
		sdr1ControlObject.addStringAttribute( attributes.sdrCurrentProfile.name, 'профиль_2');
		sdr1ControlObject.addStringAttribute( attributes.sdrProfileList.name, JSON.stringify( ["профиль_1", "профиль_2", "профиль_3"]));

		var showCounter = 0

		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){
				var expected = { items: [ {name: "  профиль_1"}, {name: "* профиль_2"}, {name: "  профиль_3"} ]};
				assert.deepEqual( descriptor.data, expected);
				selectMenuItem( descriptor.id, 0) },

		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrCurrentProfile.name, function( attribute){
			assert.equal( attribute.attributeValue, 'профиль_1');
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue)
			var expected = { items: [ {name: "* профиль_1"}, {name: "  профиль_2"}, {name: "  профиль_3"} ]};
			assert.deepEqual( descriptor.data, expected);

			done()
		})
	})

	it( 'conv: add conventional profile', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '1');

		var showCounter = 0

		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ inputLineEditData( descriptor.id, 'профиль_4') },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrAddProfile.name, function( attribute){
			assert.equal( attribute.attributeValue, 'профиль_4');
			done()
		})
	})

	it( 'conv: rename conventional profile', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '1');
		sdr1ControlObject.addStringAttribute( attributes.sdrProfileList.name, JSON.stringify( ["профиль_1", "профиль_2", "профиль_3"]));

		var showCounter = 0

		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 2) },

			function( descriptor){
				var expected = { items: [ {name: "профиль_1"}, {name: "профиль_2"}, {name: "профиль_3"} ]};
				assert.deepEqual( descriptor.data, expected);
				selectMenuItem( descriptor.id, 0) },

			function( descriptor){ inputLineEditData( descriptor.id, 'профиль_5') },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrRenameProfile.name, function( attribute){
			var expected = { srcProfileName:"профиль_1",dstProfileName:"профиль_5"}
			assert.deepEqual( JSON.parse( attribute.attributeValue), expected);
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue)
			var expected = { items: [ {name: "профиль_5"}, {name: "профиль_2"}, {name: "профиль_3"} ]};
			assert.deepEqual( descriptor.data, expected);

			done()
		})
	})

	it( 'conv: delete conventional profile', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '1');
		sdr1ControlObject.addStringAttribute( attributes.sdrProfileList.name, JSON.stringify( ["профиль_1", "профиль_2", "профиль_3"]));

		var showCounter = 0

		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },

			function( descriptor){
				var expected = { items: [ {name: "профиль_1"}, {name: "профиль_2"}, {name: "профиль_3"} ]};
				assert.deepEqual( descriptor.data, expected);
				selectMenuItem( descriptor.id, 1) },

			function( descriptor){ selectMenuItem( descriptor.id, 0) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrRenameProfile.name, function( attribute){
			var expected = 'профиль_2'
			assert.deepEqual( attribute.attributeValue, expected);
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue)
			var expected = { items: [ {name: "профиль_1"}, {name: "профиль_3"} ]};
			assert.deepEqual( descriptor.data, expected);

			done()
		})
	})

	it( 'scan: set scanning profile for base channel', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '2');
		sdr1ControlObject.addStringAttribute( attributes.sdrProfileList.name, JSON.stringify( ["профиль_1", "профиль_2", "профиль_3"]));
		sdr1ControlObject.addStringAttribute( attributes.sdrChannelProfile.name, "профиль_2");

		sdr1ControlObject.onceAttributeSet( attributes.sdrNumber.name, function( attribute){
			assert.equal( attribute.attributeValue, '8');
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrChannelProfile.name, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue), {number:8,name:"профиль_1"});
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue).data, { items: [ {name: "* профиль_1"}, {name: "  профиль_2"}, {name: "  профиль_3"} ]});
			done()
		})

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){
				assert.deepEqual( descriptor.data, { items: [ {name: "  профиль_1"}, {name: "* профиль_2"}, {name: "  профиль_3"} ]});
				selectMenuItem( descriptor.id, 0)
			},
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})
	})

	it( 'scan: set scanning profile for 3rd channel', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '2');
		sdr1ControlObject.addStringAttribute( attributes.sdrProfileList.name, JSON.stringify( ["профиль_1", "профиль_2", "профиль_3"]));
		sdr1ControlObject.addStringAttribute( attributes.sdrChannelProfile.name, "профиль_2");

		sdr1ControlObject.onceAttributeSet( attributes.sdrNumber.name, function( attribute){
			assert.equal( attribute.attributeValue, '2');
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrChannelProfile.name, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue), {number:2,name:"профиль_1"});
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue).data, { items: [ {name: "* профиль_1"}, {name: "  профиль_2"}, {name: "  профиль_3"} ]});
			done()
		})

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){
				assert.deepEqual( descriptor.data, { items: [ {name: "  профиль_1"}, {name: "* профиль_2"}, {name: "  профиль_3"} ]});
				selectMenuItem( descriptor.id, 0)
			},
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})
	})

	it( 'scan: set timestep', function( done){

		var oldTimeStep = '10'
		var newTimeStep = '15'

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '2');
		sdr1ControlObject.addStringAttribute( attributes.sdrTimeStep.name, oldTimeStep);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 9) },
			function( descriptor){
				assert.equal( descriptor.data.defaultValue, oldTimeStep);
				inputLineEditData( descriptor.id, newTimeStep)
			},
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrTimeStep.name, function( attribute){
			assert.equal( attribute.attributeValue, newTimeStep);
			done()
		})
	})

	it( 'fhss: set frequency plan', function( done){

		var oldFreqPlan = '1'
		var newFreqPlan = '0'

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '3');
		sdr1ControlObject.addStringAttribute( attributes.sdrFreqPlan.name, oldFreqPlan);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){
				assert.deepEqual( descriptor.data, { items: [ {name:"  Один диап."},{name:"* Разн.диап."} ]});
				selectMenuItem( descriptor.id, 0)
			},
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrFreqPlan.name, function( attribute){
			assert.equal( attribute.attributeValue, newFreqPlan);
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue).data, { items: [ {name:"* Один диап."},{name:"  Разн.диап."} ]});
			done()
		})
	})

	it( 'fhss: set start time', function( done){

		var oldTime = '2013.11.17 23:59:59'
		var newTime = '2013.11.17 23:59:58'

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '3');
		sdr1ControlObject.addStringAttribute( attributes.sdrFhssStartTime.name, oldTime);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 2) },
			function( descriptor){
				assert.equal( descriptor.data.defaultValue, oldTime);
				inputLineEditData( descriptor.id, newTime)
			},
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrFhssStartTime.name, function( attribute){
			assert.equal( attribute.attributeValue, newTime);
			done()
		})
	})

	it( 'fhss -> recv/send -> set range', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '3');
		sdr1ControlObject.addStringAttribute( attributes.sdrFreqPlan.name, '0');

		var oldRange = {
			number: 7,
			begin: 30000,
			end: 108000
		}

		var newRange = {
			number: 7,
			begin: 40000,
			end: 107000
		}

		sdr1ControlObject.addStringAttribute( attributes.dn1.name, JSON.stringify( oldRange));

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){
				assert.equal( descriptor.data.defaultValue, oldRange.begin + '-' + oldRange.end);
				inputLineEditData( descriptor.id, newRange.begin + '-' + newRange.end)
			},
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.dn1.name, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue), newRange);
			done()
		})
	})

	it( 'fhss -> send -> set range', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrMode.name, '3');
		sdr1ControlObject.addStringAttribute( attributes.sdrFreqPlan.name, '1');

		var oldRange = {
			number: 7,
			begin: 30000,
			end: 108000
		}

		var newRange = {
			number: 7,
			begin: 40000,
			end: 107000
		}

		sdr1ControlObject.addStringAttribute( attributes.dn2.name, JSON.stringify( oldRange));

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){
				assert.equal( descriptor.data.defaultValue, oldRange.begin + '-' + oldRange.end);
				inputLineEditData( descriptor.id, newRange.begin + '-' + newRange.end) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.dn2.name, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue), newRange);
			done()
		})
	})

	it( 'set state', function( done){

		pmControlbject.addStringAttribute( attributes.pmSdr1Enabled.name, '0');

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){
				assert.deepEqual( descriptor.data, { items: [ {name:"  Вкл"},{name:"* Выкл"} ]});
				selectMenuItem( descriptor.id, 0) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		pmControlbject.onceAttributeSet( attributes.pmSdr1Enabled.name, function( attribute){
			assert.equal( attribute.attributeValue, '1');
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue).data, { items: [ {name:"* Вкл"},{name:"  Выкл"} ]});
			done()
		})
	})

	it( 'set baf', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrBaf.name, '30-50');

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){
				assert.deepEqual( descriptor.data, { items: [ {name:"  Выкл"},{name:"* Вкл диап(30-50)"},{name:"  Вкл диап(65-108)"} ]});
				selectMenuItem( descriptor.id, 0) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrBaf.name, function( attribute){
			assert.equal( attribute.attributeValue, '30-108');
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue).data, { items: [ {name:"* Выкл"},{name:"  Вкл диап(30-50)"},{name:"  Вкл диап(65-108)"} ]});
			done()
		})
	})

	it( 'ready?', function( done){

		sdr1ControlObject.addStringAttribute( attributes.sdrFreq.name, '30000');
		sdr2ControlObject.addStringAttribute( attributes.sdrFreq.name, '--');

		var showCounter = 0
		var onShowActions = [
			function( descriptor) {
				assert.deepEqual(descriptor.data, {items: [{"name": "УП1: готов"}, {"name": "УП2: не готов"}]});
				done()
			}
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})
	})

	it( 'conv -> set recv freq', function( done){

		var oldValue = '30000'
		var newValue = '40000'

		sdr1ControlObject.addStringAttribute( attributes.sdrFreq.name, oldValue);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){
				assert.equal( descriptor.data.defaultValue, converter.fromHzToKHz( oldValue));
				inputLineEditData( descriptor.id, converter.fromHzToKHz( newValue)) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrFreq.name, function( attribute){
			assert.equal( attribute.attributeValue, newValue);
			done()
		})
	})

	it( 'set modulation', function( done){

		var oldValue = '1'
		var newValue = '0'

		sdr1ControlObject.addStringAttribute( attributes.mdl.name, oldValue);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){
				assert.deepEqual(descriptor.data, {items: [{"name": "  ЧМ-25 кГц"},{"name": "* ЧМ-12.5 кГц"}]});
				selectMenuItem( descriptor.id, 0) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.mdl.name, function( attribute){
			assert.equal( attribute.attributeValue, newValue);
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual( JSON.parse( attribute.attributeValue).data, {items: [{"name": "* ЧМ-25 кГц"},{"name": "  ЧМ-12.5 кГц"}]});
			done()
		})
	})

	it( 'set rate', function( done){

		var oldValue = '4800'
		var newValue = '2400'

		sdr1ControlObject.addStringAttribute( attributes.rate.name, oldValue);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 2) },
			function( descriptor){
				assert.deepEqual(descriptor.data, {"items":[{"name":"  1.2 Кбит/c"},{"name":"  2.4 Кбит/c"},{"name":"* 4.8 Кбит/c"},{"name":"  9.6 Кбит/c"},{"name":"  16 Кбит/c"},{"name":"  32 Кбит/c"},{"name":"  48 Кбит/c"},{"name":"  64 Кбит/c"}]})
				selectMenuItem( descriptor.id, 1) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.rate.name, function( attribute){
			assert.equal( attribute.attributeValue, newValue);
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual(JSON.parse( attribute.attributeValue).data, {"items":[{"name":"  1.2 Кбит/c"},{"name":"* 2.4 Кбит/c"},{"name":"  4.8 Кбит/c"},{"name":"  9.6 Кбит/c"},{"name":"  16 Кбит/c"},{"name":"  32 Кбит/c"},{"name":"  48 Кбит/c"},{"name":"  64 Кбит/c"}]})
			done()
		})
	})

	it( 'set transmitter on/off', function( done){

		var oldValue = '0'
		var newValue = '1'

		sdr1ControlObject.addStringAttribute( attributes.transmitterOff.name, oldValue);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){
				assert.deepEqual(descriptor.data, {"items":[{"name":"  Вкл"},{"name":"* Выкл"}]})
				selectMenuItem( descriptor.id, 0) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.rate.name, function( attribute){
			assert.equal( attribute.attributeValue, newValue);
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual(JSON.parse( attribute.attributeValue).data, {"items":[{"name":"* Вкл"},{"name":"  Выкл"}]})
			done()
		})
	})

	it( 'set signal power', function( done){

		var oldValue = '2'
		var newValue = '1'

		sdr1ControlObject.addStringAttribute( attributes.signalPower.name, oldValue);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 4) },
			function( descriptor){
				assert.deepEqual(descriptor.data, {"items":[{"name":"  Минимальная"},{"name":"  Низкая"},{"name":"* Средняя"},{"name":"  Высокая"},{"name":"  Максимальная"}]})
				selectMenuItem( descriptor.id, 1) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.signalPower.name, function( attribute){
			assert.equal( attribute.attributeValue, newValue);
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual(JSON.parse( attribute.attributeValue).data, {"items":[{"name":"  Минимальная"},{"name":"* Низкая"},{"name":"  Средняя"},{"name":"  Высокая"},{"name":"  Максимальная"}]})
			done()
		})
	})

	it( 'set noize suppressor on/off', function( done){

		var oldValue = '0'
		var newValue = '1'

		sdr1ControlObject.addStringAttribute( attributes.noizeSuppress.name, oldValue);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 5) },
			function( descriptor){
				assert.deepEqual(descriptor.data, {"items":[{"name":"  Вкл"},{"name":"* Выкл"}]})
				selectMenuItem( descriptor.id, 0) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.noizeSuppress.name, function( attribute){
			assert.equal( attribute.attributeValue, newValue);
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			assert.deepEqual(JSON.parse( attribute.attributeValue).data, {"items":[{"name":"* Вкл"},{"name":"  Выкл"}]})
			done()
		})
	})

	it( 'scan receive', function( done){

		var oldValue = '30000'
		var newValue = '40000'

		sdr1ControlObject.addStringAttribute( attributes.sdrFreq.name, oldValue);
		sdr1ControlObject.addStringAttribute( attributes.sdrFreqScan.name);
		sdr1ControlObject.addStringAttribute( attributes.sdrAcceptFreqScan.name);
		sdr1ControlObject.addStringAttribute( attributes.sdrCancelFreqScan.name);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 6) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){
				setTimeout( function(){
					sendEvent( sdr1ControlObject.name, attributes.sdrFreq.name, newValue);
				}, 100)
			},
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		cpControlObject.onceAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			var descriptor = JSON.parse( attribute.attributeValue)
			assert.deepEqual(descriptor.data, {"items":[{"name":"Частота: " + converter.fromHzToKHz( newValue) + " кГц"},{"name":"Сканировать"},{"name":"Принять"},{"name":"Отменить"}]})
			selectMenuItem( descriptor.id, 2)
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrAcceptFreqScan.name, function( attribute){
			assert.equal( attribute.attributeValue, newValue);
			done()
		})
	})

	it( 'set dual simplex on/off', function( done){

		var oldValue = '0'
		var newValue = '1'

		sdr1ControlObject.addStringAttribute( attributes.dualSimplex.name, oldValue);

		var oldFreqValue = '30000'
		var newFreqValue = '40000'
		sdr1ControlObject.addStringAttribute( attributes.sdrFreqSend.name, oldFreqValue);

		var showCounter = 0
		var onShowActions = [
			function( descriptor){ selectMenuItem( descriptor.id, 0) },
			function( descriptor){ selectMenuItem( descriptor.id, 3) },
			function( descriptor){ selectMenuItem( descriptor.id, 1) },
			function( descriptor){ selectMenuItem( descriptor.id, 7) },
			function( descriptor){
				assert.deepEqual(descriptor.data, {"items":[{"name":"  Вкл"},{"name":"* Выкл"}]})
				selectMenuItem( descriptor.id, 0)
			},
			function( descriptor){
				assert.equal( descriptor.data.defaultValue, converter.fromHzToKHz( oldFreqValue));
				inputLineEditData( descriptor.id, converter.fromHzToKHz( newFreqValue)) },
		]

		cpControlObject.onAttributeSet( CP_SHOW_ATTR_NAME, function( attribute){
			if( onShowActions[ showCounter])
				onShowActions[ showCounter]( JSON.parse( attribute.attributeValue))
			++showCounter
		})

		sdr1ControlObject.onceAttributeSet( attributes.dualSimplex.name, function( attribute){
			assert.equal( attribute.attributeValue, newValue);
		})

		sdr1ControlObject.onceAttributeSet( attributes.sdrFreqSend.name, function( attribute){
			assert.equal( attribute.attributeValue, newFreqValue);
		})

		var repaintCounter = 0
		var onRepaintActions = [
			function( descriptor){
				assert.deepEqual(descriptor.data, {"items":[{"name":"* Вкл"},{"name":"  Выкл"},{"name":"Част.прд."}]})
				selectMenuItem( descriptor.id, 2)
			},
			function( descriptor){
				assert.deepEqual(descriptor.data, {"items":[{"name":"* Вкл"},{"name":"  Выкл"},{"name":"Част.прд."}]})
				done()
			},
		]
		cpControlObject.onAttributeSet( CP_REPAINT_ATTR_NAME, function( attribute){
			if( onRepaintActions[ repaintCounter])
				onRepaintActions[ repaintCounter]( JSON.parse( attribute.attributeValue))
			++repaintCounter
		})
	})
	
	function inputLineEditData( widgetId, text){
		var data = {
				widgetId: widgetId,
				value: text
		} 
		
		var message  = new Message( cpControlObject.name) 
		message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_LINEEDIT_INPUT_DATA_EVENT, JSON.stringify( data))

		setTimeout( function(){
			subject.sendNotification( scriptCOName, message)
		}, 0)
	}
	
	function acceptDialogWidget( widgetId){
		var data = {
				widgetId: widgetId,
		} 
		
		var message  = new Message( cpControlObject.name) 
		message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_ACCEPT_DIALOG_EVENT, JSON.stringify( data)) 
		
		subject.sendNotification( scriptCOName, message) 
	}
	
	function cancelDialogWidget( widgetId){
		var data = {
				widgetId: widgetId,
		} 
		
		var message  = new Message( cpControlObject.name) 
		message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_CLOSE_WIDGET_EVENT, JSON.stringify( data))

		setTimeout( function(){
			subject.sendNotification( scriptCOName, message)
		}, 0)
	}
	
	function selectMenuItem( menuId, itemId){
		var data = {
				widgetId: menuId,
				menuItemId: itemId
		} 
		
		var message  = new Message( cpControlObject.name) 
		message.createCall( cpControlObject.name).createEvent( cpControlObject.name, CP_MENU_ITEM_ACTIVATED_EVENT, JSON.stringify( data))

		setTimeout( function(){
			subject.sendNotification( scriptCOName, message)
		}, 0)

	}
	
	function sendEvent( name, event, data ) {
		var message  = new Message( name) 
		if( data instanceof Object) {
			data = JSON.stringify( data) 
		}
		message.createCall( name).createEvent( name, event, data)
		subject.sendNotification( scriptCOName, message)
	}
}) 
