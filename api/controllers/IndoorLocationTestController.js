/**
 * IndoorLocationTestController
 *
 * @description :: Server-side logic for managing Indoorlocationtests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var mysql = require('mysql');

var env = process.env.NODE_ENV || 'development';
var config = require("../../config/config.js")[env];
var db_test = config.database_test;

module.exports = {
	// Temporal API for testing. Get Tester Location ID from testing_application_db. Used by test_APP
	// Building acronym as request parameter (building_acr)

	/**
	 * @api {get} /getTesterLocationID?building_acr=[building_acr] Get tester ID.
	 * @apiDescription 
	 * Allows to get the correspondent Tester Location ID from the database schema testing_application_db.
	 * It makes use of a view designed in the database for this specific purpose (‘view_locId_buAcr’).
	 * Then the results are filtered in order to show only the data from the building specified as parameter (building_acr).
	 * One input parameter is mandatory when calling the API: building_acr. 
	 *
	 * @apiName getTesterLocationID
	 * @apiGroup IndoorLocationTest
	 * 
	 * @apiParam {String} building_acr It corresponds to the building acronym, stored as ‘tester_build_acr’ in the table ‘experiment_tester’. 
	 * @apiParamExample {String} Request-Example:
	 * ?building_acr=SB
	 *
	 * @apiSuccess {JSON} json Tester ids for the building specified.
	 * 
	 * @apiExample {http} Example usage:
 	 * GET api.iitrtclab.com/indoorLocationTest/getTesterLocationID?building_acr=AM
	 *
	 * @apiPermission none
 	 * @apiVersion 1.0.0
	 */
	getTesterLocationID: function(req,res){
		var parameters = req.allParams();

		var con = mysql.createConnection(db_test);

		con.connect(function(err){
			if(err){
				console.log('Error connecting to db');
				console.log(err);
				return;
			}
			console.log('Connection to db established');
			// If no parameters in the request.
			if(Object.keys(parameters).length === 0){
				console.log('No parameters in the request');
				con.end(function(err) {
					  	// The connection is terminated gracefully
					  	// Ensures all previously enqueued queries are still
					  	// before sending a COM_QUIT packet to the MySQL server.
						console.log('Connection to db terminated')
					});
	  		}
	  		//If parameters in the request
	  		else{
	  			console.log('Params in the request: ',parameters);
	  			// If the parameters are correct in the request (building and floor)
	  			if(Object.keys(parameters).indexOf('building_acr') !== -1){
	  				var building_acr = req.param('building_acr')
	  				console.log('\nBUILDING ACRONYM: ',building_acr);
					// con.query("SELECT experiment_tester.tester_id AS tester_id , experiment_tester.tester_build_acr AS tester_build_acr FROM testing_application_db.experiment_tester WHERE (tester_build_acr ='"+building_acr+"');"
						con.query("SELECT * FROM testing_application_db.view_locId_buAcr WHERE (tester_build_acr ='"+building_acr+"');"	
						,function(err,rows,fields){
					  	if(err) throw err;

					  	console.log('Data received from db\n');
					  	console.log(rows);
					  	res.json({rows});
					  
					});
	  			}
	  			else{
	  				console.log('Incorrect parameters in the request.');
	  				res.send('Incorrect parameters in the request. Remember to include building and floor.');
	  			}
	  			con.end(function(err) {
				  	// The connection is terminated gracefully
				  	// Ensures all previously enqueued queries are still
				  	// before sending a COM_QUIT packet to the MySQL server.
					console.log('Connection to db terminated')
				});
	  		}
		});
	},

	// For testApp experiments

	/**
	 * @api {post} /createTestEvent?runnumber=[runnumber]&testlocationid=[testlocationid] Create new test event.
	 * @apiDescription 
	 * Performs changes in the analysis database testing_application_db.
	 * Creates a new record in the table ‘experiment_event’, including the parameters in the columns ‘tev_fk_run_id’ and ‘tev_fk_tester_id’, respectively.
	 * Both input parameters are mandatory in the request: runnumber and testlocationid. 
	 *
	 * @apiName createTestEvent
	 * @apiGroup IndoorLocationTest
	 * 
	 * @apiParam {Number} runnumber Experiment run id.
	 * @apiParam {Number} testlocationid Experiment tester id.
	 * @apiParamExample {String} Request-Example:
	 * ?runnumber=4&testlocationid=136
	 *
	 * @apiSuccess {JSON} json Success.
	 * {succes:1,testeventid:result.insertId}
	 * @apiExample {http} Example usage:
 	 * POST api.iitrtclab.com/indoorLocationTest/createTestEvent?runnumber=4&testlocationid=136
	 *
	 * @apiPermission admin	 
 	 * @apiVersion 1.0.0
	 */
	createTestEvent: function(req,res){
		var parameters = req.allParams();

		var con = mysql.createConnection(db_test);

		con.connect(function(err){
			if(err){
				console.log('Error connecting to db');
				console.log(err);
				return;
			}
			console.log('Connection to db established');
			// If no parameters in the request.
			if(Object.keys(parameters).length === 0){
				console.log('No parameters in the request');
				con.end(function(err) {
					  	// The connection is terminated gracefully
					  	// Ensures all previously enqueued queries are still
					  	// before sending a COM_QUIT packet to the MySQL server.
						console.log('Connection to db terminated')
					});
				res.json({succes:0,message:'No parameters in the request'});
	  		}
	  		//If parameters in the request
	  		else{
	  			console.log('Params in the request: ',parameters);
	  			// If the parameters are correct in the request (building and floor)
	  			if(Object.keys(parameters).indexOf('runnumber') !== -1 && Object.keys(parameters).indexOf('testlocationid') !== -1){
	  				var runNumber = req.param('runnumber');
					var testLocationID = req.param('testlocationid');
	  				
	  				var sql = "INSERT INTO testing_application_db.experiment_event (tev_fk_run_id,tev_fk_tester_id) VALUES ("+runNumber+","+testLocationID+")";
					con.query(sql,
						function(err,result){
					  	if(err) throw err;
					  	console.log('Data inserted in database'+result.insertId);
					  	res.json({succes:1,testeventid:result.insertId});
					});
	  			}
	  			else{
	  				console.log('Required field(s) is missing.');
	  				res.json({succes:0,message:'Required field(s) is missing.'});
	  			}
	  			con.end(function(err) {
				  	// The connection is terminated gracefully
				  	// Ensures all previously enqueued queries are still
				  	// before sending a COM_QUIT packet to the MySQL server.
					console.log('Connection to db terminated')
				});
	  		}
		});
	},

	// API for storing test data

	/**
	 * @api {post} /storeTestData?jsonArray=[{major:[major1],minor:[minor1],rssi:[rssi1],testnum:[testnum1]},{major:[major2],minor:[minor2],rssi:[rssi2],testnum:[testnum2]},…] Store test data in analysis database.
	 * @apiDescription 
	 * Stores the data resulting from the test experiments performed by the Test App, in the database testing_application_db, in the table ‘experiment_datapoint’.
	 * The input parameter jsonArray is mandatory in the request.
	 *
	 * @apiName storeTestData
	 * @apiGroup IndoorLocationTest
	 * 
	 * @apiParam {JSON[]} jsonArray Array of JSONs, each one of them specifying the major, minor, rssi and testnum of an iBeacon.
	 * @apiParamExample {String} Request-Example:
	 * ?jsonArray=[{major:[major1],minor:[minor1],rssi:[rssi1],testnum:[testnum1]},{major:[major2],minor:[minor2],rssi:[rssi2],testnum:[testnum2]},…]
	 *
	 * @apiSuccess {String} String Success.
	 * 'Success storing iBeacons'
	 * @apiExample {http} Example usage:
 	 * POST api.iitrtclab.com/indoorLocationTest/storeTestData?jsonArray=[{major:[major1],minor:[minor1],rssi:[rssi1],testnum:[testnum1]},{major:[major2],minor:[minor2],rssi:[rssi2],testnum:[testnum2]},…]
	 *
	 * @apiPermission admin
 	 * @apiVersion 1.0.0
	 */
	storeTestData: function(req,res){
		var parameters = req.allParams();

		var con = mysql.createConnection(db_test);

		con.connect(function(err){
			if(err){
				console.log('Error connecting to db');
				console.log(err);
				return;
			}
			console.log('Connection to db established');
			// If no parameters in the request.
			if(Object.keys(parameters).length === 0){
				console.log('No parameters in the request');
				con.end(function(err) {
					  	// The connection is terminated gracefully
					  	// Ensures all previously enqueued queries are still
					  	// before sending a COM_QUIT packet to the MySQL server.
						console.log('Connection to db terminated')
					});
				res.json({succes:0,message:'No parameters in the request'});
	  		}
	  		//If parameters in the request
	  		else{
	  			console.log('Params in the request: ',parameters);
	  			// If the parameters are correct in the request (building and floor)
	  			if(Object.keys(parameters).indexOf('jsonArray') !== -1){
	  				var jsonArray = req.param('jsonArray');
	  				// console.log('HERE...',jsonArray);
	  				// console.log('HERE 2...',jsonArray.length);
	  				jsonArray = JSON.parse(jsonArray);
	  				// console.log('HERE 3...',jsonArray);

	  				var major = '';
	  				var minor = '';
	  				var rssi = '';
	  				var testnum = '';
	  				var sql = '';

	  				for(var i = 0; i<jsonArray.length ; i++){
	  					major = jsonArray[i].major;
	  					minor = jsonArray[i].minor;
	  					rssi = jsonArray[i].rssi;
	  					testnum = jsonArray[i].testnum;
	  					console.log(major,minor,rssi,testnum);

	  					sql = "INSERT INTO testing_application_db.experiment_datapoint (dp_major,dp_minor,dp_rssi,dp_fk_tev_id) VALUES ("+major+","+minor+","+rssi+","+testnum+")";
						con.query(sql,
							function(err,result){
						  	if(err) throw err;
						  	console.log('Data from detected iBeacons stored ');
						});
	  				}
					res.send('Success storing iBeacons');

	  				
	  			}
	  			else{
	  				console.log('Required field(s) is missing.');
	  				res.json({succes:0,message:'Required field(s) is missing.'});
	  			}
	  			con.end(function(err) {
				  	// The connection is terminated gracefully
				  	// Ensures all previously enqueued queries are still
				  	// before sending a COM_QUIT packet to the MySQL server.
					console.log('Connection to db terminated')
				});
	  		}
		});
	}
};

