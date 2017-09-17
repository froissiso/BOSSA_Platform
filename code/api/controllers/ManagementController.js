/**
 * ManagementController
 *
 * @description :: Server-side logic for managing Managements
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var mysql = require('mysql');

module.exports = {
	// /Management/setBeacon?major=[major]&minor=[minor]&locId=[locId]

	/**
	 * @api {post} /setBeacon?major=[major]&minor=[minor]&locId=[locId] Set or replace beacon.
	 * @apiDescription
	 * Allows to change the location of a beacon to a certain location. The location of the beacon previously deployed in that location is set to null, which implies it is not deployed anymore.
	 * All the input parameters are mandatory in the request.
	 *
	 * @apiName setBeacon
	 * @apiGroup Management
	 * 
	 * @apiParam {String} major Major of the beacon.
	 * @apiParam {String} minor Minor of the beacon.
	 * @apiParam {String} locId Identifier of the beacon's new location. 
	 * @apiParamExample {String} Request-Example:
	 * /setBeacon?major=2000&minor=577&locId=100
	 *
	 * @apiSuccess {String} String Success.
	 * 'Success'
	 * 
	 * @apiExample {http} Example usage:
 	 * POST api.iitrtclab.com/management/setBeacon?major=2000&minor=577&locId=100
	 *
	 * @apiPermission admin
 	 * @apiVersion 1.0.0
	 */
	setBeacon: function(req,res){
		var parameters = req.allParams();

		var con = mysql.createConnection({
			host: "accesspointlocationserver.cbkzo1niupv4.us-east-1.rds.amazonaws.com",
			user: "neil",
			password: "neilpassword",
			database: "testing_application_db"
		});

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
	  			if((Object.keys(parameters).indexOf('major') !== -1) && (Object.keys(parameters).indexOf('minor') !== -1) && (Object.keys(parameters).indexOf('locId') !== -1)){
	  				var major = req.param('major');
	  				var minor = req.param('minor');
	  				var locId = req.param('locId');

	  				console.log('\nMajor: ',major);
	  				console.log('\nMinor: ',minor);
	  				console.log('\nLocation Id: ',locId);

					// con.query(
					//   "UPDATE indoor_location_db.beacon_info SET b_fk_loc_id = ? Where b_major = ? AND b_minor= ?",
					//   [null, major, minor],
					//   function (err, result) {
					//     if (err) throw err;
					//     console.log('Changed ' + result.changedRows + ' rows');
					//   }
					// );
					var b_fk_loc_id = '';
					con.query("SELECT * FROM indoor_location_db.beacon_info WHERE (b_major ='"+major+"' AND b_minor='"+minor+"');"	
					,function(err,rows){
					  	if(err) throw err;

					  	console.log('Data received from db\n');
					  	console.log('b_fk_loc_id',rows[0].b_fk_loc_id);
					  	// var json_rows = JSON.parse();
					  	b_fk_loc_id = rows[0].b_fk_loc_id;
					  	console.log('b_fk_loc_id',b_fk_loc_id);
					  	if(b_fk_loc_id==null){
					  		console.log('');

					  		con.query(
								  "UPDATE indoor_location_db.beacon_info SET b_fk_loc_id = ? Where b_fk_loc_id = ? ",
								  [null, locId],
								  function (err, result) {
								    if (err) throw err;
								    console.log('Changed ' + result.changedRows + ' rows');

								    con.query(
									  "UPDATE indoor_location_db.beacon_info SET b_fk_loc_id = ? Where b_major = ? AND b_minor= ?",
									  [locId, major, minor],
									  function (err, result) {
									    if (err) throw err;
									    console.log('Changed ' + result.changedRows + ' rows');
									    
									    con.end(function(err) {
									  	// The connection is terminated gracefully
									  	// Ensures all previously enqueued queries are still
									  	// before sending a COM_QUIT packet to the MySQL server.
										console.log('Connection to db terminated')
										});

								  		res.send('Success');
									  }
									);
								  }
							);
					  	}
					  	else{
					  		console.log('The ibeacon is already deployed.');
					  		res.send('The ibeacon is already deployed.')
					  	}
					});

					// con.query(
					//   "UPDATE indoor_location_db.beacon_info SET b_fk_loc_id = ? Where b_major = ? AND b_minor= ?",
					//   [null, major, minor],
					//   function (err, result) {
					//     if (err) throw err;
					//     console.log('Changed ' + result.changedRows + ' rows');
					//   }
					// );
	  			}
	  			else{
	  				console.log('Incorrect parameters in the request.');
	  				res.send('Incorrect parameters in the request. Remember to include building and floor.');
	  				con.end(function(err) {
				  	// The connection is terminated gracefully
				  	// Ensures all previously enqueued queries are still
				  	// before sending a COM_QUIT packet to the MySQL server.
					console.log('Connection to db terminated')
					});
	  			}
	  		}
		});
	},
	// example: http://smith-system-f.herokuapp.com/indoorLocationManagement/sergeantUpdateTest
	// Parameters: { json: 'mac=A0E6F8698E63,temp=23.81,humidity=49.64,voltage=3,battery=61 ' }
	sergeantUpdateTest: function(req,res){
		var parameters = req.allParams();
		console.log(req);
		console.log("Parameters:",parameters);
		res.send('Test OK');
	},
	
	// {"mac": "macAddress", "temp":"temp", "humidity":"humidity"}

	// example: http://smith-system-f.herokuapp.com/indoorLocation/sergeantUpdate?mac=A0:E6:F8:69:F9:89&temp=1111111&humidity=222222
	sergeantUpdateOld: function(req,res){
		console.log('Sergeant update in course.');

		var parameters = req.allParams();
		console.log("Parameters:",parameters);

		var con = mysql.createConnection({
			host: "accesspointlocationserver.cbkzo1niupv4.us-east-1.rds.amazonaws.com",
			user: "neil",
			password: "neilpassword",
			database: "indoor_location"
		});

		con.connect(function(err){
			if(err){
				console.log('Error connecting to db');
				console.log(err);
				return;
			}
			console.log('Connection to db established');
			console.log('Number of parameters: ',Object.keys(parameters).length);
			// If no parameters in the request.
			if(Object.keys(parameters).length === 0){
				console.log('No parameters in the request');

				// var new_update = { text_update: 'No value in the request'};
				// con.query('INSERT INTO indoor_location.temp_table_testing_particle SET ?', new_update, function(err,res){
				//   if(err) throw err;

				//   console.log('Last insert ID:', res.insertId);
				// });

				con.end(function(err) {
				  	// The connection is terminated gracefully
				  	// Ensures all previously enqueued queries are still
				  	// before sending a COM_QUIT packet to the MySQL server.
					console.log('Connection to db terminated')
				});

	  		}
	  		//If parameters in the request
	  		// 
	  		else{
	  			console.log('Params in the request: ',parameters);
	  			if((Object.keys(parameters).indexOf('mac') !== -1)&&(Object.keys(parameters).indexOf('temp') !== -1)&&(Object.keys(parameters).indexOf('humidity') !== -1)){
	  				var new_update = { atm_fk_beacon_id: req.param('mac'),atm_temperature: req.param('temp'),atm_humidity: req.param('humidity')};
					con.query('INSERT INTO indoor_location_db.beacon_atmosphere SET ?', new_update, function(err,res){
					  if(err) throw err;

					  console.log('Last insert ID:', res.insertId);
					});

					con.end(function(err) {
					  	// The connection is terminated gracefully
					  	// Ensures all previously enqueued queries are still
					  	// before sending a COM_QUIT packet to the MySQL server.
						console.log('Connection to db terminated')
					});
					res.send("Success");
	  			}
	  			else{
	  				console.log('Not all parameters included in the request.')
	  				con.end(function(err) {
					  	// The connection is terminated gracefully
					  	// Ensures all previously enqueued queries are still
					  	// before sending a COM_QUIT packet to the MySQL server.
						console.log('Connection to db terminated')
					});
	  			}
	  		}
		});
	},

	// Api for sergeants' update. Configured in Webhook Particle so it calls the api regularly to make the updates.

	/**
	 * @api {post} /sergeantUpdate?json=[json] Store atmosphere data.
	 * @apiDescription
	 * Api for sergeants' update. Configured in Webhook Particle so it calls the api regularly to make the updates.
	 * Allows to send atmosphere (temperature and humidity) data of a certain beacon, so it can be stored in the correspondent tables in the Indoor Location database schema (indoor_location_db).
	 * This API is specifically designed for its use by the Particle cloud service’s tool Webhook, which uses the API regularly to send the information received from the sergeants.
	 *
	 * @apiName sergeantUpdate
	 * @apiGroup Management
	 * 
	 * @apiParam {JSON} json Particular to the needs of the could service. It includes values for the MAC address of the beacon (mac), the temperature and humidity values (temp and humidity), as well as the voltage and battery of the device (voltage and battery), if reported.
	 *
	 * @apiSuccess {String} String Success.
	 * "success"
	 * 
	 * @apiPermission admin
 	 * @apiVersion 1.0.0
	 */
	sergeantUpdate: function(req,res){
		var coreid = req.query.coreid;
		console.log("coreid:",coreid);
		var parseString=function(json){
			var mac=json.substring(json.indexOf("mac=")+4,json.indexOf("mac=")+16);
			var temp=json.substring(json.indexOf("temp=")+5,json.indexOf("temp=")+10);
			var humidity=json.substring(json.indexOf("humidity=")+9,json.indexOf("humidity=")+14);
			var voltage=json.substring(json.indexOf("voltage=")+8,json.indexOf("voltage=")+9);
			var battery=json.substring(json.indexOf("battery=")+8,json.indexOf("battery=")+10);
			return {"mac": mac, "temp" : parseFloat(temp), "humidity" : parseFloat(humidity), "voltage" : parseInt(voltage), "battery" : parseInt(battery)};
		}
		var addColon=function(mac){
			var initialMac=mac;
			var newMac='';
			for(var i = 0; i < initialMac.length; i+=2){
				newMac=newMac+initialMac.substring(i,i+2)+":";	
			}
			console.log(newMac);
			return newMac.substring(0,newMac.length-1);
		}
		
		var con = mysql.createConnection({
			host: "accesspointlocationserver.cbkzo1niupv4.us-east-1.rds.amazonaws.com",
			user: "neil",
			password: "neilpassword",
			database: "indoor_location_db"
		});
		var insert="INSERT into beacon_atmosphere (atm_fk_beacon_id,atm_temperature,atm_humidity) VALUES (?,?,?)";
		// var insertBattery="INSERT into voltage (voltage,batteryPercentage) VALUES (?,?)";
		var insertVoltage="INSERT into device_voltage (vo_fk_device_id,vo_level) VALUES (?,?)";
		var insertBattery="INSERT into sergent_battery (ba_fk_sergent_id,ba_number) VALUES (?,?)";
		var json=parseString(req.query.json)
		//console.log("dqkdjqjdq"+JSON.parse(req.query.json));
		con.query(insert,[addColon(json.mac),json.temp,json.humidity],function(err, result){
			if (err) throw err;
			con.query(insertVoltage,[coreid,json.voltage],function(err, result){
				if (err) throw err;
				con.query(insertBattery,[coreid,json.battery],function(err, result){
					if (err) throw err;
					con.end(function(err) {
					  	// The connection is terminated gracefully
					  	// Ensures all previously enqueued queries are still
					  	// before sending a COM_QUIT packet to the MySQL server.
						console.log('Connection to db terminated')
					});
					res.send("success");
				});
			});
		});	
	},
};

