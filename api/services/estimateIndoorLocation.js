//var args = process.argv;
var mysql = require('mysql');
var async = require('async');
var locations = new Array();

var location_algorithm = undefined;
var output_format = undefined;
var callback_to_return_output = undefined;

var env = process.env.NODE_ENV || 'development';
var config = require("../../config/config.js")[env];
var db = config.database;

//var test = args[3] != null && args[3] === "true";

//Calls Ibeacon
//Has Major Minor and RSSI
function IBeacon(major, minor, rssi){
	
	this.major = major;
	this.minor = minor;
	this.rssi  = rssi;
}

//Class Location - This will be the base class for the Algorithm

function Location(major, minor, location, rssi){
	this.major = major;
	this.minor = minor;
	this.location = location;
	this.rssi = rssi; 
}

//First Function to be called by the program
// OLD
// function start(req,res){
//     if (args[2] != null){
//         parsed = JSON.parse(args[2]);
//         var foundBeacons = parsed.map(
//                 function(beacon) {return new IBeacon(beacon['major'], beacon['minor'], beacon['rssi']) });
//         getSql(foundBeacons, test);
        
//     } else {
//         console.log(makeXML(undefined,undefined, "no valid beacons"));
//         throw "no valid beacons"
//     }
// }

//First Function to be called by the program
function start(test,json,algorithm,res,output_for,cb){
    callback_to_return_output = cb;
    location_algorithm = algorithm;
    output_format = output_for;
    console.log('2 value of param test: ',test);
    console.log('2 value of param json: ',json);
    if(json!=undefined){
        var json2 = json;
        //console.log(typeof(json2));
        // Delete [] from the edges of the json2 parameter
        // json2.trim();
        // if(json2.charAt(0)==='['){
        //     json2 = json2.substring(1,json2.length);
        // };
        // if(json2.charAt(json2.length-1) ===']'){
        //     json2 = json2.substring(0,json2.length-1);
        // };
        console.log('2 value of param json2: ',json2.length);

        if (json2.trim()!==""){
            //var beacon_jsons_array = json2.split(',');
            var beacon_jsons_array = new Array();
            var first = 0;
            for(var y = 0 ; y<json2.length ; y++){
                if(json2.charAt(y)==='{'){
                    var subs = json2.substring(first,y-1);
                    console.log(subs);
                    subs.trim();
                    if(subs!==""){
                        beacon_jsons_array.push(subs);
                    }
                    first = y;
                }
            }
            
            var foundBeacons = new Array();

            for(var i = 0 ; i<beacon_jsons_array.length ; i++){
                beacon_jsons_array[i].trim();
                parsed = JSON.parse(beacon_jsons_array[i]);
                if(parsed.major){
                    var major = parsed.major;
                }
                else if(parsed.Major){
                    var major = parsed.Major;
                };
                if(parsed.minor){
                    var minor = parsed.minor;
                }
                else if(parsed.Minor){
                    var minor = parsed.Minor;
                };
                if(parsed.rssi){
                    var rssi = parsed.rssi;
                }
                else if(parsed.Rssi){
                    var rssi = parsed.Rssi;
                };
               
                //console.log("Beacon number "+i+": "+major+ " "+minor+" "+rssi);
                foundBeacons.push(new IBeacon(major,minor,rssi));
            }

            //?test=true&json=[{"major":101,"minor":130,"rssi":-87},{"major":101,"minor":157,"rssi":-87},{"major":101,"minor":124,"rssi":-80},{"major":101,"minor":202,"rssi":-84},{"major":101,"minor":172,"rssi":-85}]
            //console.log("type of parsed : ",typeof(parsed));

            //parsed = JSON.parse(json);

            // var foundBeacons = new Array();
            //     for (var i = 2; i < args.length; i=i+3){
            //         var major = clean(args[i]);
            //         var minor = clean(args[i+1]);
            //         var rssi = clean(args[i+2]);
            //         var ibeacon = new IBeacon(major, minor, rssi);
            //         foundBeacons.push(ibeacon);
            //  }

            // var foundBeacons = 

            // var foundBeacons = parsed.map(
            //     function(beacon) {
            //         return new IBeacon(beacon['major'], beacon['minor'], beacon['rssi']) });
            // var foundBeacons = parsed.map(
            //     function(beacon) {return new IBeacon(beacon['major'], beacon['minor'], beacon['rssi']) });
            console.log("foundBeacons ",foundBeacons);
            console.log("\n");

            getSql(foundBeacons, test, res);
            
        } else {
            console.log(makeXML(undefined,undefined, "no valid beacons"));
            throw "no valid beacons"
        }
    }
    
    //new
    //console.log(args);
    //console.log('2 value of args2: ',args[2]);
    //console.log('2 value of req: ',req);
    //console.log('2 value of res: ',res);

}

//new
exports.start = start;



function found(array, beacon){
		for( i = 0 ; i < array.length; i++){
			x = array[i];
			if(x.minor == beacon.minor){
				return true;
			}
		}
	return false;
}


function getSql (beaconArray, test, res) {
	var asyncArray = [];
	for(var i = 0 ; i < beaconArray.length; i++){
		var beacon = new IBeacon(beaconArray[i].major, beaconArray[i].minor, beaconArray[i].rssi);
		asyncArray = asyncTask(asyncArray,beacon);
	}
	async.parallel(asyncArray, function () {

        // if the beacon isn't from the current experiment, asyncArray[i] will equal undefined.
        // so we'll filter out those values.
        asyncArray = asyncArray.filter( 
                        function(n){
                            return n != null;
                        });
		finalTask(res);
	});
}


function finalTask(res) {
        var lastLocation = undefined;
        var callback = function(location){
            lastLocation = location;

            var con = mysql.createConnection(db);
            
            var queryX = "Select * from indoor_location_db.building_info where bu_acronym = '"+lastLocation.location[0]+"'";
            con.query(queryX, function (error, rows) {
                if(error){
                    throw error;
                }
                var result = '';
                if(output_format == 'xml'){
                    result = makeXML(lastLocation,rows[0]);
                }
                else if(output_format == 'json'){
                    result = makeJSON(lastLocation,rows[0]);
                }
                //var xml = makeXML(lastLocation,rows[0]);
                console.log(result);
                con.end();
                //console.log('callback function',callback_to_return_output);
                callback_to_return_output(result);
                //res.send(xml);
            });
        };
        console.log('Location algorithm:',location_algorithm);
        switch (location_algorithm){
            case 'minRSSI':
                getMin(locations, callback);
                
                break;
            case 'LeastSquared':
                //getLeastSquared(locations,callback);
                res.send('Under construction');
                break;
            case 'StdDev':
                //getStdDev(locations,callback);
                res.send('Under construction');     
                break;
            default:
                console.log('Invalid algorithm selected.');
                break;
        }
}

function getLeastSquared(locations,callback){
    callback('');
}

function getStdDev(locations,callback){
    callback('');
}

function newSql(ibeacon, callback) {
	
	var con = mysql.createConnection(db);

    // OLD Query for the previous database (APDB)
	// var Query = "SELECT l.DeployID, di.major, di.minor, l.Acronym, l.Floor, l.RoomType, l.RoomNumber, l.NearestWall "+
	// "FROM APDB.LocationUsed lu "+
	// "INNER JOIN APDB.DevicesInfo di ON di.CoreID=lu.CoreID "+
	// "INNER JOIN APDB.DeployLocation l ON lu.deploylocid=l.DeployID "+
	// "Where major = "+ibeacon.major +" and minor = "+ibeacon.minor;

    // if (test) { // experiment 0 is for presentations and testing
    //     Query += " and experimentid = 0;";
    // } else { // look to the most recent experiment
    //     Query += " and experimentid = (select max(ExperimentID) from BTExperiment);";
    // }

    // // NEW Query to adapt it to the new database (indoor_location)
    // var query1 = "SELECT l.loc_id, di.d_major, di.d_minor, bu.bu_acronym, l.loc_floor, l.loc_room_type, l.loc_room_number, l.loc_nearest_wall "+
    // "FROM indoor_location.device_location lu "+
    // "INNER JOIN indoor_location.device_info di ON di.d_id=lu.dloc_fk_device_id "+
    // "INNER JOIN indoor_location.location_info l ON lu.dloc_fk_location_id=l.loc_id "+
    // "INNER JOIN indoor_location.location_building bu ON l.loc_fk_building_id=bu.bu_id "+
    // "Where d_major = "+ibeacon.major +" and d_minor = "+ibeacon.minor;

    // NEW Query to adapt it to the new database (indoor_location)
    // var query1 = "SELECT * FROM indoor_location.view_indoor_location Where d_major = "+ibeacon.major +" and d_minor = "+ibeacon.minor;

    // NEW Query to adapt it to the new database (indoor_location_db)
    var query1 = "SELECT * FROM indoor_location_db.view_indoor_location Where b_major = "+ibeacon.major +" and b_minor = "+ibeacon.minor;

    // TO DO
    // Adapt this code to the experiment tables on the new database
    // if (test) { // experiment 0 is for presentations and testing
    //     Query += " and experimentid = 0;";
    // } else { // look to the most recent experiment
    //     Query += " and experimentid = (select max(ExperimentID) from BTExperiment);";
    // }
	
	con.query(query1, function (error, rows) {
		if(error){
			console.log(makeXML(undefined,undefined, "query to DB failed"));
            con.end();
			throw error;
        } else if (rows.length == 1) {
			var newarr = [rows[0].bu_acronym,rows[0].loc_floor,rows[0].loc_room_number,rows[0].loc_room_type];
			var location = new Location(ibeacon.major, ibeacon.minor, newarr, ibeacon.rssi);

            if (location != null) {
                locations.push(location);
                console.log(location);			
            }

		}
		con.end();
		callback();
	});
	
}

function asyncTask(asyncArray, beacon) {
    asyncArray.push(function (callback) {
        newSql(beacon, callback);
    });
	return asyncArray;
}

function getMin (locations,cb) {
    console.log('\n\n',locations,'\n\n');
    if (locations[0] == null){
        console.log(makeXML(undefined,undefined, "no valid beacons"));
        throw "No valid beacons";
    }
    var min = locations[0].rssi;
    var returnLocation = locations[0];
	
	for(var i = 0; i < locations.length; i++){
        if (min > locations[i].rssi) { 
            min = locations[i].rssi;
            returnLocation = locations[i];
		}
	}
	// return returnLocation;
    cb(returnLocation);
}


function makeXML(current,place, err){
    console.log("---------------------\n",current,"\n-------\n",place,"\n---------------------");
    locdata = "";
    if (!err){
        locdata +='        <ca:country>us</ca:country>\n'
        locdata +='        <ca:A1>IL</ca:A1>\n'
        locdata +='        <ca:A2>chicagosouth</ca:A2>\n'
        locdata +='        <ca:A6>'+place.bu_road_name+'</ca:A6>\n'
        locdata +='        <ca:PRD>'+place.bu_road_direction+'</ca:PRD>\n'
        locdata +='        <ca:STS>'+place.bu_road_type+'</ca:STS>\n'
        locdata +='        <ca:HNO>'+place.bu_road_number+'</ca:HNO>\n'
        locdata +='        <ca:LOC>Used iBeacon Location system solution</ca:LOC>\n'
        locdata +='        <ca:FLR>'+current.location[1]+'</ca:FLR>\n'
        locdata +='        <ca:ROOM>'+current.location[2]+'</ca:ROOM>\n'
        locdata +='	       <ca:PLC>'+current.location[3]+'</ca:PLC>\n'		

    } else {
        locdata +='        <ca:country>us</ca:country>\n'
        locdata +='        <ca:A1>IL</ca:A1>\n'
        locdata +='        <ca:A2>chicagosouth</ca:A2>\n'
        locdata +='        <ca:A6> Lake Shore </ca:A6>\n'
        locdata +='        <ca:PRD>S</ca:PRD>\n'
        locdata +='        <ca:STS>Dr</ca:STS>\n'
        locdata +='        <ca:HNO>1300</ca:HNO>\n'
        locdata +='        <ca:LOC>Error in nead.bramsoft.com script: '+ err +'</ca:LOC>\n'
        locdata +='        <ca:FLR>NA</ca:FLR>\n'
        locdata +='        <ca:ROOM>NA</ca:ROOM>\n'
        locdata +='	       <ca:PLC>NA</ca:PLC>\n'		
    }
        
    var timestamp = new Date();
    var timestampISO = timestamp.toISOString();
    
    var xml = '<?xml version="1.0" encoding="ISO-8859-1"?>\n'
    xml+='<presence xmlns="urn:ietf:params:xml:ns:pidf"\n'
    xml+='    xmlns:gp="urn:ietf:params:xml:ns:pidf:geopriv10"\n'
    xml+='    xmlns:ca="urn:ietf:params:xml:ns:pidf:geopriv10:civicAddr"\n'
    xml+='    xmlns:gml="http://www.opengis.net/gml"\n'
    xml+='    entity="sip:caller@64.131.109.27">\n'
    xml+='  <tuple id="id82848">\n'
    xml+='   <status>\n'
    xml+='    <gp:geopriv>\n'
    xml+='     <gp:location-info>\n'
    xml+='       <ca:civicAddress>\n'
    xml+= locdata
    xml+='       </ca:civicAddress>\n'
    xml+='     </gp:location-info>\n'
    xml+='     <gp:usage-rules/>\n'
    xml+='     <gp:method>Manual</gp:method>\n'
    xml+='    </gp:geopriv>\n'
    xml+='   </status>\n'
    xml+='  <contact priority="0.8">sip:caller@64.131.109.27</contact>\n'
    xml+='<timestamp>'+timestampISO+'</timestamp>\n'
    xml+='  </tuple>\n'
    xml+='</presence>'
    return xml;
}

function makeJSON(current,place, err){
    console.log("---------------------\n",current,"\n-------\n",place,"\n---------------------");
    json = {};
    if (!err){
        var civic_address = place.bu_road_number + " " + place.bu_road_direction + " " + place.bu_road_name + " " + place.bu_road_type;
        json = {Room:current.location[2],Floor:current.location[1],CivicAddress:civic_address,PLC:current.location[3]};
    }
    return json;
}

//start();