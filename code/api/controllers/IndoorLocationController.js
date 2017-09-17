/**
 * IndoorLocationController
 *
 * @description :: Server-side logic for managing indoorlocation apis
 */

var mysql = require('mysql');

module.exports = {
	// generic actions for tests
	test: function(req, res, next){
		res.json({test: true});
	},
	actionX: function(req, res){
		console.log('config',config.database);
		return res.send('Hi there');
	},
	bye: function(req, res){
		return res.redirect('http://appliedtech.iit.edu');
	},

	// MAPS apis

	// get map from a certain building and floor
	getMap: function(req, res){
		return res.send(' Please, use getMapPNG or getMapPDF ');
	},

	/**
	 * @api {get} /getMapPDF?building=[building]&floor=[floor] Get PDF map for building and floor.
	 * @apiDescription Two parameters are needed in the request: building AND floor.
	 * Current building and floor maps available (July 2017):
	 *	Alumni_Hall (AM-00, AM-01, AM-02) ; 
	 *	IT_Tower (IT-00-21) ; 
	 *	Life_Science_Building (LS-00, LS-01, LS-02, LS-03) ; 
	 *	Perlstein_Hall (PH-00, PH-01, PH-02) ; 
	 *	Rettaliata_Engineering_Center (E1-00, E1-01, E1-02) ; 
	 *	Siegel_Hall (SH-00, SH-01, SH-02, SH-03) ; 
	 *	Stuart_Building (SB-00, SB-01, SB-02) ; 
	 *	Wishnick_Hall (WH-00, WH-01, WH-02, WH-03) .
	 * @apiName getMapPDF
	 * @apiGroup IndoorLocation
	 *
	 * @apiParam {String} bulding Building's name.
	 * @apiParam {String} floor Building's floor (Acronym and number).
	 * @apiParamExample {String} Request-Example:
 	 * ?building=Alumni_Hall&floor=AM-00
	 * @apiSuccess {PDF} map Map for the specified building and floor.
	 * 
	 * @apiExample {http} Example usage:
 	 *     GET api.iitrtclab.com/indoorLocation/getMapPDF?building=Alumni_Hall&floor=AM-00
 	 *
 	 * @apiPermission none
 	 * @apiVersion 1.0.0
	 */
	getMapPDF: function(req, res){
		console.log(req.allParams());
		console.log(req.query);
		console.log(req.body);
		var building = req.param('building');
		console.log(building);
		var floor = req.param('floor');
		console.log(floor);
		var chain = '';
		chain = chain + '/images/FloorPlans/pdf/' + building + '/' + floor + '.pdf';
		console.log(chain);
		return res.redirect(chain);
	},

	/**
	 * @api {get} /getMapPNG?building=[building]&floor=[floor] Get PNG map for building and floor..
	 * @apiDescription Two parameters are needed in the request: building AND floor.
	 * Current building and floor maps available (July 2017):
	 *	Alumni_Hall (AM-00, AM-01, AM-02) ; 
	 *	IT_Tower (IT-00-21) ; 
	 *	Life_Science_Building (LS-00, LS-01, LS-02, LS-03) ; 
	 *	Perlstein_Hall (PH-00, PH-01, PH-02) ; 
	 *	Rettaliata_Engineering_Center (E1-00, E1-01, E1-02) ; 
	 *	Siegel_Hall (SH-00, SH-01, SH-02, SH-03) ; 
	 *	Stuart_Building (SB-00, SB-01, SB-02) ; 
	 *	Wishnick_Hall (WH-00, WH-01, WH-02, WH-03) .
	 * @apiName getMapPNG
	 * @apiGroup IndoorLocation
	 *
	 * @apiParam {String} bulding Building's name.
	 * @apiParam {String} floor Building's floor (Acronym and number).
	 * @apiParamExample {String} Request-Example:
 	 * ?building=Alumni_Hall&floor=AM-00
	 * @apiSuccess {PNG} map Map for the specified building and floor.
	 * 
	 * @apiExample {http} Example usage:
 	 *     GET api.iitrtclab.com/indoorLocation/getMapPNG?building=Alumni_Hall&floor=AM-00
 	 *
 	 * @apiPermission none
 	 * @apiVersion 1.0.0
	 */
	getMapPNG: function(req, res){
		console.log(req.allParams());
		console.log(req.query);
		console.log(req.body);
		var building = req.param('building');
		console.log(building);
		var floor = req.param('floor');
		console.log(floor);
		var chain = '';
		chain = chain + '/images/FloorPlans/png/' + building + '/' + floor + '.png';
		console.log(chain);
		return res.redirect(chain);
	},


	// INDOOR LOCATION ALGORITHMS apis

	/**
	 * @api {get} /getIndoorLocation?test=[test]&json=[json] Get indoor location XML. Default location algorithm.
	 * @apiDescription 
	 * The algorithm estimates the indoor location taking as input the data from the iBeacons included in the request’s json parameter.
	 * Today (July 2017), the minRSSI algorithm is set to be the default. 
	 * The result returned is in XML PIDF-LO format. Both parameters are mandatory in the request (test and json).
	 *	
	 * @apiName getIndoorLocation
	 * @apiGroup IndoorLocation
	 * @apiParam {boolean} test Identifies test requests to the API. By default, set to true.
	 * @apiParam {JSON[]} json Includes an array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.
	 * @apiParamExample {String} Request-Example:
	 * ?test=true&json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0}]
	 * @apiSuccess {XML} xml Location in XML PIDF-LO format.
	 * 
	 * @apiExample {http} Example usage:
 	 *     GET api.iitrtclab.com/indoorLocation/getIndoorLocation?test=true&json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0}]
 	 *
 	 * @apiPermission none
 	 * @apiVersion 1.0.0
	 */

	getIndoorLocation: function(req,res){
		var estimateIL = require("../services/estimateIndoorLocation.js");
		var parameters = req.allParams();

		// Uncomment the correspondent algorithm to make it default
		var defaultAlgorithm = 'minRSSI';
		// var defaultAlgorithm = 'LeastSquared';
		// var defaultAlgorithm = 'StdDev';
	
		//estimateIL.start(req.param('test'), req.param('json'), defaultAlgorithm, res, 'xml');

		//example parameters: ?test=true&json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0}]
		if((Object.keys(parameters).indexOf('test') !== -1) && (Object.keys(parameters).indexOf('json') !== -1)){
			// test input true by default
			estimateIL.start(req.param('test'), req.param('json'), defaultAlgorithm, res, 'xml',cb=function(result){
				console.log('estimation:',result);
				res.send(result);
			});
		}
		else{
			var error = "ERROR: ";
			if((Object.keys(parameters).indexOf('test') == -1)){
				error += "\n- Please, include the input parameter 'test'. If you are not sure of its value for your request, set it to true."
			}
			if((Object.keys(parameters).indexOf('json') == -1)){
				error += "\n- Please, include the input parameter 'json' with an array of iBeacons. Example: json=[{\"Major\":101,\"Minor\":175,\"Rssi\":-91.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-92.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-93.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-80.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-83.0}]"
			}
			res.send(error);
		}
		
	},

	// Accepts parameters in the request case-insensitevily (major,minor,rssi,Major,Minor,Rssi)

	/**
	 * @api {get} /getIndoorLocationMinRSSI?test=[test]&json=[json] Get indoor location XML. MinRSSI algorithm.
	 * @apiDescription 
	 * The algorithm estimates the indoor location taking as input the data from the iBeacons included in the request’s json parameter.
	 * The result returned is in XML PIDF-LO format. Both parameters are mandatory in the request (test and json).
	 *	
	 * @apiName getIndoorLocationMinRSSI
	 * @apiGroup IndoorLocation
	 * 
	 * @apiParam {boolean} test Identifies test requests to the API. By default, set to true.
	 * @apiParam {JSON[]} json Includes an array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.
	 * @apiParamExample {String} Request-Example:
	 * ?test=true&json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0}]
	 * @apiSuccess {XML} xml Location in XML PIDF-LO format.
	 * 
	 * @apiExample {http} Example usage:
 	 *     GET api.iitrtclab.com/indoorLocation/getIndoorLocationMinRSSI?test=true&json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0}]
 	 *
 	 * @apiPermission none
 	 * @apiVersion 1.0.0
	 */
	getIndoorLocationMinRSSI: function(req,res){
		var estimateIL = require("../services/estimateIndoorLocation.js");
		var parameters = req.allParams();
		// estimateIL.start(req.param('test'), req.param('json'), 'minRSSI', res, 'xml');

		if((Object.keys(parameters).indexOf('test') !== -1) && (Object.keys(parameters).indexOf('json') !== -1)){
			// test input true by default
			estimateIL.start(req.param('test'), req.param('json'), 'minRSSI', res, 'xml',cb=function(result){
				console.log('estimation:',result);
				res.send(result);
			});
		}
		else{
			var error = "ERROR: ";
			if((Object.keys(parameters).indexOf('test') == -1)){
				error += "\n- Please, include the input parameter 'test'. If you are not sure of its value for your request, set it to true."
			}
			if((Object.keys(parameters).indexOf('json') == -1)){
				error += "\n- Please, include the input parameter 'json' with an array of iBeacons. Example: json=[{\"Major\":101,\"Minor\":175,\"Rssi\":-91.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-92.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-93.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-80.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-83.0}]"
			}
			res.send(error);
		}
	},

	// Request examples:
	// /indoorLocation/getIndoorLocationLeastSquared?nbeacons=5&nfbeacons=3&proximity=-70,5,-60,3,-50,2,-40,1&testid=333
	// /indoorLocation/getIndoorLocationLeastSquared?testid=333
	//  /IndoorLocation/getIndoorLocationLeastSquared?json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0},{"Major":101,"Minor":202,"Rssi":-76.0},{"Major":101,"Minor":202,"Rssi":-82.0},{"Major":101,"Minor":202,"Rssi":-84.0},{"Major":101,"Minor":202,"Rssi":-79.0},{"Major":101,"Minor":202,"Rssi":-86.0},{"Major":101,"Minor":202,"Rssi":-84.0}]
	
	/**
	 * @api {get} /getIndoorLocationLeastSquared?json=[json] Get indoor location XML. Least Squares algorithm. 
	 * @apiDescription 
	 * The algorithm calculates the coordinates taking as input the data from the iBeacons included in the request’s json parameter. 
	 * The algorithm is only executed if data from at least 4 iBeacons is specified. This is for conceptual reasons concerning the Least Squared algorithm. 
	 * Instead of the json parameter, it can be specified the test id (testid), for analysis purposes.
	 * One and only one of the following input parameters must be included in the request: json OR testid. The rest of the parameters related to testid are optional.
	 *
	 *	
	 * @apiName getIndoorLocationLeastSquared
	 * @apiGroup IndoorLocation
	 * 
	 * @apiParam {JSON[]} json Array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.
	 * @apiParam {Number} testid flag used for analysis; it takes an integer input, which should be a valid test id. It returns a json output, with information needed to render the test’s results. The testid parameter accepts several parameters as options, which can be individually included or not: nbeacons, nfbeacons and proximity.
	 * @apiParamExample {String} Request-Example:
	 * ?json=[json]
	 * ?testid=[testid]
	 * ?testid=[testid]&nbeacons=[nbeacons]&nfbeacons=[nfbeacons]&proximity=[proximity]
	 *
	 * @apiSuccess {String[]} String[] X and Y coordinates.
	 * 
	 * @apiExample {http} Example usage:
 	 * GET api.iitrtclab.com/indoorLocation/getIndoorLocationLeastSquared?json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0}]
 	 * GET api.iitrtclab.com/indoorLocation/getIndoorLocationLeastSquared?testid=333
	 * GET api.iitrtclab.com/indoorLocation/getIndoorLocationLeastSquared?testid=333&nbeacons=5&nfbeacons=3&proximity=-70,5,-60,3,-50,2,-40,1
	 *
	 * @apiPermission none
 	 * @apiVersion 1.0.0
	 */
	getIndoorLocationLeastSquared: function(req,res){
		//var estimateIL = require("../services/estimateIndoorLocation.js");
		//estimateIL.start(req.param('test'), req.param('json'), 'LeastSquared', res);
		var parameters = req.allParams();
		var PythonShell = require('python-shell');
		var pyscript = 'py_script_LeastSquared.py';
		// Only one of the parameters should be included in the request. testid OR json
		if(Object.keys(parameters).length === 0){
			console.log('No parameters in the request');
			res.send('ERROR: Need a testid or json of BT data. Please, include one of the following parameters in the request: testid OR json');
		}
		else{
			var options = {};
			if((Object.keys(parameters).indexOf('testid') !== -1)&&(Object.keys(parameters).indexOf('json') !== -1)){
				console.log('testid and json parameters included at the same time. Only one of them should be included.');
				res.send('Only one of the functionalities can be executed. Please include testid OR json as parameter in the request.');
			}
			else{
				/* 
				The flag --testid is used for analysis; it takes an integer input, which should be a 
				valid testid. If the testid is invalid (the db lookup finds nothing), the script puts 
				nothing on stdout. This should be followed by throwing an error by the API. 
				It returns a json output, with I believe all the information I will need to usefully 
				render the test’s results.
				*/
				if(Object.keys(parameters).indexOf('testid') !== -1){
					var arguments = new Array();
					var testid_param = "--testid="+req.param('testid');
					arguments.push(testid_param);
					// Add optional parameters if they are included in the request
					if(Object.keys(parameters).indexOf('nbeacons') !== -1){
						var nbeacons_param = '--nbeacons='+req.param('nbeacons');
						arguments.push(nbeacons_param);
					}
					if(Object.keys(parameters).indexOf('nfbeacons') !== -1){
						var nfbeacons_param = '--nfbeacons='+req.param('nfbeacons');
						arguments.push(nfbeacons_param);
					}
					if(Object.keys(parameters).indexOf('proximity') !== -1){
						var proximity_param_list = req.param('proximity');
						console.log('proximity_param_list: ',proximity_param_list);
						// proximity_param_list = proximity_param_list.replace(/,/g,' ');
						
						// var proximity_param_spaced = '';
						// for(var i = 0 ; i<proximity_param_array.length ; i++){
						// 	// proximity_param_spaced += proximity_param_array[i];
						// 	// proximity_param_spaced += ' ';
						// }		

						var proximity_param = '--proximity='+proximity_param_list;
						console.log('proximity_param: ',proximity_param);
						arguments.push(proximity_param);
					}
					console.log('Arguments: ',arguments);
					options = {
						mode: 'text',
						//pythonPath: 'path/to/python',
						//pythonOptions: ['-testid'],
						scriptPath: 'assets/py',
						//args: ['value1', 'value2', 'value3']
						args: arguments
					};
					console.log('Options: ',options);
					PythonShell.run(pyscript, options, function (err, results) {
					  if (err) throw err;
					  // results is an array consisting of messages collected during execution 
					  console.log('results: %j', results);
					  res.send(results);
					});
				}

				/*
				The flag --inputbt is used for realtime updating; it takes a json input, 
				of the form [ {‘Major’: 101, ‘Minor’: 150, ‘Rssi’: -90} ]; representing a list of 
				BT-devices collected by the phone. 
				It prints to stdout the json {‘x0’: 10.32, ‘y0’: 32.3}, representing 
				the estimated x, y coordinates of the caller.
				*/
				// Example request: http://localhost:1337/IndoorLocation/getIndoorLocationLeastSquared?json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0},{"Major":101,"Minor":202,"Rssi":-76.0},{"Major":101,"Minor":202,"Rssi":-82.0},{"Major":101,"Minor":202,"Rssi":-84.0},{"Major":101,"Minor":202,"Rssi":-79.0},{"Major":101,"Minor":202,"Rssi":-86.0},{"Major":101,"Minor":202,"Rssi":-84.0}]
				else if(Object.keys(parameters).indexOf('json') !== -1){
					console.log('Json param: ',req.param('json'),'\n');
					var num_beacons = JSON.parse(req.param('json')).length;
					console.log('num_beacons: ',num_beacons);
					if(num_beacons > 3){
						options = {
						mode: 'text',
						scriptPath: 'assets/py',
						//args: ['--inputbt='+'[{"Major": 101, "Minor": 175, "Rssi": -91.0}, {"Major": 101, "Minor": 175, "Rssi": -92.0}, {"Major": 101, "Minor": 175, "Rssi": -93.0}, {"Major": 101, "Minor": 202, "Rssi": -80.0}, {"Major": 101, "Minor": 202, "Rssi": -83.0}, {"Major": 101, "Minor": 202, "Rssi": -76.0}, {"Major": 101, "Minor": 202, "Rssi": -82.0}, {"Major": 101, "Minor": 202, "Rssi": -84.0}, {"Major": 101, "Minor": 202, "Rssi": -79.0}, {"Major": 101, "Minor": 202, "Rssi": -86.0}, {"Major": 101, "Minor": 202, "Rssi": -84.0}]']
						//args: ['--inputbt='+"'"+req.param('json')+"'"]
						args: ['--inputbt='+req.param('json')]
						};
						console.log('Options: ',options);
						PythonShell.run(pyscript, options, function (err, results) {
						  if (err) throw err;
						  // results is an array consisting of messages collected during execution 
						  console.log('results: %j', results);
						  res.send(results);
						});
					}
					else{
						var error = "ERROR: In order to execute the Least Squared, you must include data from at least 4 beacons in the request."
						res.send(error);
					}
					
				}
			}
		}
	},

	// Remember to put the parameters with the firts letter as capital letter, in order to be compatible with both apis: minRSSI(case-insensitive) and LeastSquared(needed with first letter capital: "Major","Minor","Rssi")
	// input: [{Major,Minor,Rssi},{Major,Minor,Rssi},...]
	// json output: {room:,floor:,civic_address:,x:,y:}
	// examples input:
	// /indoorLocation/getIndoorLocationJSON?test=true&json=[{%22Major%22:101,%22Minor%22:175,%22Rssi%22:-91.0},{%22Major%22:101,%22Minor%22:175,%22Rssi%22:-92.0},{%22Major%22:101,%22Minor%22:175,%22Rssi%22:-93.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-80.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-83.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-76.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-82.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-84.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-79.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-86.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-84.0}]
	// https://34.206.146.223/indoorLocation/getIndoorLocationJSON?test=true&json=[{%22Major%22:101,%22Minor%22:175,%22Rssi%22:-91.0},{%22Major%22:101,%22Minor%22:175,%22Rssi%22:-92.0},{%22Major%22:101,%22Minor%22:175,%22Rssi%22:-93.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-80.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-83.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-76.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-82.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-84.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-79.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-86.0},{%22Major%22:101,%22Minor%22:202,%22Rssi%22:-84.0}]
	// example output: 
	// {
	//   "Room": 206,
	//   "Floor": 2,
	//   "CivicAddress": "10 W 31st St",
	//   "PLC": "SouthHallway",
	//   "y0": 45.23206327641591,
	//   "x0": 15.007866960614173
	// }

	/**
	 * @api {get} /getIndoorLocationJSON?test=[test]&json=[json] Get indoor location in JSON format. MinRSSI and Least Squares algorithms.
	 * @apiDescription 
	 * The algorithms estimate the indoor location and coordinates taking as input the data from the iBeacons included in the request’s json parameter.
	 * The result returned by the API is in JSON format.
	 * Both parameters are mandatory in the request (test and json).
	 * The two algorithms (minRSSI and LeastSquared) are executed only in the case that data from at least 4 iBeacons is included in the request. This is for a reason of concept concerning the Least Squared algorithm. If the json input parameter shows information of 3 or less beacons, only the minRSSI algorithm is executed, and therefore no x, y coordinates are included in the API’s result.
	 * It is important to do the request to the API as shown in the example below, including Major, Minor and Rssi starting with capital letter. The LeastSquared algorithm is implemented to be case sensitive.
	 *
	 * @apiName getIndoorLocationJSON
	 * @apiGroup IndoorLocation
	 * 
	 * @apiParam {boolean} test Identifies test requests to the api. By default, set to true. 
	 * @apiParam {JSON[]} json Array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.
	 * @apiParamExample {String} Request-Example:
	 * ?test=[test]&json=[json]
	 *
	 * @apiSuccess {JSON} json Location and x,y coordinates in JSON format.
	 * 
	 * @apiExample {http} Example usage:
 	 * GET api.iitrtclab.com/indoorLocation/getIndoorLocationJSON?test=true&json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0}]
	 *
	 * @apiPermission none
 	 * @apiVersion 1.0.0
	 */
	getIndoorLocationJSON: function(req,res){
		// Obtain json from minRSSI location algorithm
		var parameters = req.allParams();
		var estimateIL = require("../services/estimateIndoorLocation.js");
		if(Object.keys(parameters).length === 0){
			console.log('No parameters in the request');
			res.send('Need a testid or json of BT data. Please, include paramenters in the request.');
		}
		else if((Object.keys(parameters).indexOf('test') !== -1)&(Object.keys(parameters).indexOf('json') !== -1)){
			console.log('Json param: ',req.param('json'),'\n');
			var num_beacons = JSON.parse(req.param('json')).length;
			// test input true by default
			estimateIL.start(req.param('test'), req.param('json'), 'minRSSI', res, 'json',cb=function(firstResult){
				// console.log('firstResult:',firstResult);

				// Executes Least Squared algorithm only if there is data of at least 3 iBeacons as input. In other case, the algorithm conceptually can not be applied.
				console.log('num_beacons:',num_beacons);
				if(num_beacons > 3){
					// Obtain x and y coordinates from Least Squared algorithm
					var PythonShell = require('python-shell');
					var pyscript = 'py_script_LeastSquared.py';

					options = {
						mode: 'text',
						scriptPath: 'assets/py',
						args: ['--inputbt='+req.param('json')]
					};

					PythonShell.run(pyscript, options, function (err, results) {
					  if (err) throw err;
					  // results is an array consisting of messages collected during execution
					  var coordinatesJSON = JSON.parse(results[0]);
					  console.log('results: %j', coordinatesJSON);
					  // Add x and y coordinates to the result from the first algorithm (minRSSI)
					  firstResult['y0'] = coordinatesJSON.y0;
					  firstResult['x0'] = coordinatesJSON.x0;

					  // Send result as a json
					  res.json(firstResult);
					});
				}
				else{
					res.json(firstResult);
				}
			});
		}
	},

	/**
	 * @api {get} /getIndoorLocationCivicAddressJSON?test=[test]&json=[json] Get indoor location in JSON format. MinRSSI algorithm.
	 * @apiDescription 
	 * The algorithm estimate the indoor location taking as input the data from the iBeacons included in the request’s json parameter.
	 * The result returned by the API is in JSON format.
	 * Both parameters are mandatory in the request (test and json).
	 *
	 * @apiName getIndoorLocationCivicAddressJSON
	 * @apiGroup IndoorLocation
	 * 
	 * @apiParam {boolean} test Identifies test requests to the api. By default, set to true. 
	 * @apiParam {JSON[]} json Array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.
	 * @apiParamExample {String} Request-Example:
	 * ?test=[test]&json=[json]
	 *
	 * @apiSuccess {JSON} json Location in JSON format.
	 * 
	 * @apiExample {http} Example usage:
 	 * GET api.iitrtclab.com/indoorLocation/getIndoorLocationJSON?test=true&json=[{"Major":101,"Minor":175,"Rssi":-91.0},{"Major":101,"Minor":175,"Rssi":-92.0},{"Major":101,"Minor":175,"Rssi":-93.0},{"Major":101,"Minor":202,"Rssi":-80.0},{"Major":101,"Minor":202,"Rssi":-83.0}]
	 *
	 * @apiPermission none
 	 * @apiVersion 1.0.0
	 */
	getIndoorLocationCivicAddressJSON: function(req,res){
		// Obtain json from minRSSI location algorithm
		var parameters = req.allParams();
		var estimateIL = require("../services/estimateIndoorLocation.js");
		if(Object.keys(parameters).length === 0){
			console.log('No parameters in the request');
			res.send('Need a testid or json of BT data. Please, include paramenters in the request.');
		}
		else if((Object.keys(parameters).indexOf('test') !== -1)&(Object.keys(parameters).indexOf('json') !== -1)){
			console.log('Json param: ',req.param('json'),'\n');
			var num_beacons = JSON.parse(req.param('json')).length;
			// test input true by default
			estimateIL.start(req.param('test'), req.param('json'), 'minRSSI', res, 'json',cb=function(firstResult){
				// console.log('firstResult:',firstResult);

				console.log('num_beacons:',num_beacons);
				
				res.json(firstResult);
			});
		}
	},

		getIndoorLocationStdDev: function(req,res){
		var estimateIL = require("../services/estimateIndoorLocation.js");
		estimateIL.start(req.param('test'), req.param('json'), 'StdDev', res);
		// TODO
	},
};