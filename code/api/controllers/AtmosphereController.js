/**
 * AtmosphereController
 *
 * @description :: Server-side logic for managing Atmospheres
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var mysql = require('mysql');

 var env = process.env.NODE_ENV || 'development';
 var config = require("../../config/config.js")[env];
 var db = config.database;

 module.exports = {
	// ATMOSPHERE apis

	// Data from old database schema: indoor_location
	getAtmosphereOldDb: function(req, res){
		var parameters = req.allParams();

		var con = mysql.createConnection(db);

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

				//execute view from mysql db to show relevant atmosphere data
				con.query('SELECT * FROM indoor_location.view_atm_data;',function(err,rows,fields){
					if(err) throw err;

					console.log('Data received from db\n');
				  	//console.log(rows);
				  	for (var i = 0; i < rows.length; i++) {
				  		console.log(rows[i].id);
				  	};
				  	res.send(rows);

				  	con.end(function(err) {
					  	// The connection is terminated gracefully
					  	// Ensures all previously enqueued queries are still
					  	// before sending a COM_QUIT packet to the MySQL server.
					  	console.log('Connection to db terminated')
					  });
				  });
			}
	  		//If parameters in the request
	  		else{
	  			console.log('Params in the request: ',parameters);
	  			// If the parameters are correct in the request (building and floor)
	  			if(Object.keys(parameters).indexOf('building') !== -1 && Object.keys(parameters).indexOf('floor') !== -1){
	  				var building = req.param('building')
	  				building = building.replace('_',' ');
	  				console.log('\nBUILDING: ',building);
	  				var floor = req.param('floor');
	  				console.log('\nFLOOR',floor);
	  				//execute view from mysql db to show relevant atmosphere data
	  				con.query("SELECT * FROM indoor_location.view_atm_data WHERE (bu_name='"+building+"' AND loc_floor="+floor+");",function(err,rows,fields){
	  					if(err) throw err;

	  					console.log('Data received from db\n');
					  	//console.log(rows);
					  	for (var i = 0; i < rows.length; i++) {
					  		console.log(rows[i].id);
					  	};
					  	res.send(rows);

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

	// Data from new database schema: indoor_location_db

	/**
	 * @api {get} /getAtmosphere?building=[building]&floor=[floor]&values=[values] Get temperature and humidity data.
	 * @apiDescription 
	 * If no parameters are included in the request, the atmosphere (temperature and humidity) data and other relevant fields are retrieved, from all the entries in the table ‘beacon_atmosphere’ from the main database schema indoor_location_db. 
	 * The information is retrieved by executing the database view named ‘view_atm_data’, which was specifically designed for this purpose.
	 * In the case that building and floor parameters are included in the request (then both are needed), the data is filtered by building (‘bu_name’ in table ‘building_info’) and floor (‘loc_floor’ in table ‘device_location’). The building should be specified by name and the floor by number.
	 * If the parameter values is set in the request to the value last, only the last value registered for each iBeacon is returned. In any other case, all the data registered for the iBeacons is returned.
	 *
	 * @apiName getAtmosphere
	 * @apiGroup Atmosphere
	 * 
	 * @apiParam {String} values If set to 'last', only the last value registered for each iBeacon is returned. In any other case, all the data registered for the iBeacons is returned.
	 * @apiParam {String} building Building's name.
	 * @apiParam {String} floor Floor's number. 
	 * @apiParamExample {String} Request-Example:
	 * /atmosphere/getAtmosphere?building=Alumni_Memorial&floor=2
	 * /atmosphere/getAtmosphere?values=last
	 * /atmosphere/getAtmosphere?building=Alumni_Memorial&floor=2&values=last
	 *
	 * @apiSuccess {JSON[]} json[] Atmosphere data.
	 * 
	 * @apiExample {http} Example usage:
 	 * GET api.iitrtclab.com/atmosphere/getAtmosphere?building=Alumni_Memorial&floor=2
 	 * GET api.iitrtclab.com/atmosphere/getAtmosphere?values=last
 	 * GET api.iitrtclab.com/atmosphere/getAtmosphere?building=Alumni_Memorial&floor=2&values=last
	 *
	 * @apiPermission none
 	 * @apiVersion 1.0.0
 	 */
 	 getAtmosphere: function(req,res){
 	 	var parameters = req.allParams();

 	 	var con = mysql.createConnection(db);

 	 	con.connect(function(err){
 	 		if(err){
 	 			console.log('Error connecting to db');
 	 			console.log(err);
 	 			return;
 	 		}
 	 		console.log('Connection to db established');
 	 		console.log('Number of parameters: ',Object.keys(parameters).length);
			// If no parameters in the request.
			if(Object.keys(parameters).length === 0 || (Object.keys(parameters).length === 1 && Object.keys(parameters).indexOf('values') !== -1)){
				console.log('No parameters in the request or only values parameter');

				//execute view from mysql db to show relevant atmosphere data
				con.query('SELECT * FROM indoor_location_db.view_atm_data ORDER BY atm_check_moment DESC;',function(err,rows,fields){
					if(err) throw err;

					console.log('Data received from db\n');
				  	//console.log(rows);
				  	
				  	con.end(function(err) {
					  	// The connection is terminated gracefully
					  	// Ensures all previously enqueued queries are still
					  	// before sending a COM_QUIT packet to the MySQL server.
					  	console.log('Connection to db terminated')
					  });
				  	if(Object.keys(parameters).indexOf('values') === -1 || req.param('values') !== "last"){
				  		res.send(rows);
				  	}
				  	else if(req.param('values') == "last"){
							// Show only last value for each iBeacon
							var rows_last_values = [];
							var beacon_ids_array = [];
							for(var i = 0 ; i<rows.length ; i++){
								if(beacon_ids_array.indexOf(rows[i].b_id) == -1){
									rows_last_values.push(rows[i]);
									beacon_ids_array.push(rows[i].b_id);
								}
							}
							// console.log("beacons:",beacon_ids_array);
							res.send(rows_last_values);
						}
					});
			}
	  		//If parameters in the request
	  		else{
	  			console.log('Params in the request: ',parameters);
	  			// If the parameters are correct in the request (building and floor)
	  			if(Object.keys(parameters).indexOf('building') !== -1 && Object.keys(parameters).indexOf('floor') !== -1){
	  				var building = req.param('building')
	  				building = building.replace('_',' ');
	  				console.log('\nBUILDING: ',building);
	  				var floor = req.param('floor');
	  				console.log('\nFLOOR',floor);
	  				//execute view from mysql db to show relevant atmosphere data
	  				con.query("SELECT * FROM indoor_location_db.view_atm_data WHERE (bu_name='"+building+"' AND loc_floor="+floor+") ORDER BY atm_check_moment DESC;",function(err,rows,fields){
	  					if(err) throw err;

	  					console.log('Data received from db and ordered by time (DESC)\n');
					  	// console.log(rows[0].atm_id);
					  	con.end(function(err) {
					  	// The connection is terminated gracefully
					  	// Ensures all previously enqueued queries are still
					  	// before sending a COM_QUIT packet to the MySQL server.
					  	console.log('Connection to db terminated')
					  });
					  	if(Object.keys(parameters).indexOf('values') === -1 || req.param('values') !== "last"){
					  		res.send(rows);
					  	}
					  	else if(req.param('values') == "last"){
							// Show only last value for each iBeacon
							var rows_last_values = [];
							var beacon_ids_array = [];
							for(var i = 0 ; i<rows.length ; i++){
								if(beacon_ids_array.indexOf(rows[i].b_id) == -1){
									rows_last_values.push(rows[i]);
									beacon_ids_array.push(rows[i].b_id);
								}
							}
							// console.log("beacons:",beacon_ids_array);
							res.send(rows_last_values);
						}
					});
}
else{
	console.log('Incorrect parameters in the request.');
	con.end(function(err) {
				  	// The connection is terminated gracefully
				  	// Ensures all previously enqueued queries are still
				  	// before sending a COM_QUIT packet to the MySQL server.
				  	console.log('Connection to db terminated')
				  });
	res.send('Incorrect parameters in the request. Remember to include building and floor.');
}
}
});
},
};
