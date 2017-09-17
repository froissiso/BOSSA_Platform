define({ "api": [  {    "type": "get",    "url": "/getAtmosphere?building=[building]&floor=[floor]&values=[values]",    "title": "Get temperature and humidity data.",    "description": "<p>If no parameters are included in the request, the atmosphere (temperature and humidity) data and other relevant fields are retrieved, from all the entries in the table ‘beacon_atmosphere’ from the main database schema indoor_location_db. The information is retrieved by executing the database view named ‘view_atm_data’, which was specifically designed for this purpose. In the case that building and floor parameters are included in the request (then both are needed), the data is filtered by building (‘bu_name’ in table ‘building_info’) and floor (‘loc_floor’ in table ‘device_location’). The building should be specified by name and the floor by number. If the parameter values is set in the request to the value last, only the last value registered for each iBeacon is returned. In any other case, all the data registered for the iBeacons is returned.</p>",    "name": "getAtmosphere",    "group": "Atmosphere",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "values",            "description": "<p>If set to 'last', only the last value registered for each iBeacon is returned. In any other case, all the data registered for the iBeacons is returned.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "building",            "description": "<p>Building's name.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "floor",            "description": "<p>Floor's number.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "/atmosphere/getAtmosphere?building=Alumni_Memorial&floor=2\n/atmosphere/getAtmosphere?values=last\n/atmosphere/getAtmosphere?building=Alumni_Memorial&floor=2&values=last",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "JSON[]",            "optional": false,            "field": "json[]",            "description": "<p>Atmosphere data.</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "GET api.iitrtclab.com/atmosphere/getAtmosphere?building=Alumni_Memorial&floor=2\nGET api.iitrtclab.com/atmosphere/getAtmosphere?values=last\nGET api.iitrtclab.com/atmosphere/getAtmosphere?building=Alumni_Memorial&floor=2&values=last",        "type": "http"      }    ],    "permission": [      {        "name": "none"      }    ],    "version": "1.0.0",    "filename": "api/controllers/AtmosphereController.js",    "groupTitle": "Atmosphere"  },  {    "type": "post",    "url": "/createTestEvent?runnumber=[runnumber]&testlocationid=[testlocationid]",    "title": "Create new test event.",    "description": "<p>Performs changes in the analysis database testing_application_db. Creates a new record in the table ‘experiment_event’, including the parameters in the columns ‘tev_fk_run_id’ and ‘tev_fk_tester_id’, respectively. Both input parameters are mandatory in the request: runnumber and testlocationid.</p>",    "name": "createTestEvent",    "group": "IndoorLocationTest",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "runnumber",            "description": "<p>Experiment run id.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "testlocationid",            "description": "<p>Experiment tester id.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?runnumber=4&testlocationid=136",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "JSON",            "optional": false,            "field": "json",            "description": "<p>Success. {succes:1,testeventid:result.insertId}</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "POST api.iitrtclab.com/indoorLocationTest/createTestEvent?runnumber=4&testlocationid=136",        "type": "http"      }    ],    "permission": [      {        "name": "admin"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationTestController.js",    "groupTitle": "IndoorLocationTest"  },  {    "type": "get",    "url": "/getTesterLocationID?building_acr=[building_acr]",    "title": "Get tester ID.",    "description": "<p>Allows to get the correspondent Tester Location ID from the database schema testing_application_db. It makes use of a view designed in the database for this specific purpose (‘view_locId_buAcr’). Then the results are filtered in order to show only the data from the building specified as parameter (building_acr). One input parameter is mandatory when calling the API: building_acr.</p>",    "name": "getTesterLocationID",    "group": "IndoorLocationTest",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "building_acr",            "description": "<p>It corresponds to the building acronym, stored as ‘tester_build_acr’ in the table ‘experiment_tester’.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?building_acr=SB",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "JSON",            "optional": false,            "field": "json",            "description": "<p>Tester ids for the building specified.</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "GET api.iitrtclab.com/indoorLocationTest/getTesterLocationID?building_acr=AM",        "type": "http"      }    ],    "permission": [      {        "name": "none"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationTestController.js",    "groupTitle": "IndoorLocationTest"  },  {    "type": "post",    "url": "/storeTestData?jsonArray=[{major:[major1],minor:[minor1],rssi:[rssi1],testnum:[testnum1]},{major:[major2],minor:[minor2],rssi:[rssi2],testnum:[testnum2]},…]",    "title": "Store test data in analysis database.",    "description": "<p>Stores the data resulting from the test experiments performed by the Test App, in the database testing_application_db, in the table ‘experiment_datapoint’. The input parameter jsonArray is mandatory in the request.</p>",    "name": "storeTestData",    "group": "IndoorLocationTest",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "JSON[]",            "optional": false,            "field": "jsonArray",            "description": "<p>Array of JSONs, each one of them specifying the major, minor, rssi and testnum of an iBeacon.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?jsonArray=[{major:[major1],minor:[minor1],rssi:[rssi1],testnum:[testnum1]},{major:[major2],minor:[minor2],rssi:[rssi2],testnum:[testnum2]},…]",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "String",            "description": "<p>Success. 'Success storing iBeacons'</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "POST api.iitrtclab.com/indoorLocationTest/storeTestData?jsonArray=[{major:[major1],minor:[minor1],rssi:[rssi1],testnum:[testnum1]},{major:[major2],minor:[minor2],rssi:[rssi2],testnum:[testnum2]},…]",        "type": "http"      }    ],    "permission": [      {        "name": "admin"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationTestController.js",    "groupTitle": "IndoorLocationTest"  },  {    "type": "get",    "url": "/getIndoorLocation?test=[test]&json=[json]",    "title": "Get indoor location XML. Default location algorithm.",    "description": "<p>The algorithm estimates the indoor location taking as input the data from the iBeacons included in the request’s json parameter. Today (July 2017), the minRSSI algorithm is set to be the default. The result returned is in XML PIDF-LO format. Both parameters are mandatory in the request (test and json).</p>",    "name": "getIndoorLocation",    "group": "IndoorLocation",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "boolean",            "optional": false,            "field": "test",            "description": "<p>Identifies test requests to the API. By default, set to true.</p>"          },          {            "group": "Parameter",            "type": "JSON[]",            "optional": false,            "field": "json",            "description": "<p>Includes an array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?test=true&json=[{\"Major\":101,\"Minor\":175,\"Rssi\":-91.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-92.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-93.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-80.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-83.0}]",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "XML",            "optional": false,            "field": "xml",            "description": "<p>Location in XML PIDF-LO format.</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "GET api.iitrtclab.com/indoorLocation/getIndoorLocation?test=true&json=[{\"Major\":101,\"Minor\":175,\"Rssi\":-91.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-92.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-93.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-80.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-83.0}]",        "type": "http"      }    ],    "permission": [      {        "name": "none"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationController.js",    "groupTitle": "IndoorLocation"  },  {    "type": "get",    "url": "/getIndoorLocationCivicAddressJSON?test=[test]&json=[json]",    "title": "Get indoor location in JSON format. MinRSSI algorithm.",    "description": "<p>The algorithm estimate the indoor location taking as input the data from the iBeacons included in the request’s json parameter. The result returned by the API is in JSON format. Both parameters are mandatory in the request (test and json).</p>",    "name": "getIndoorLocationCivicAddressJSON",    "group": "IndoorLocation",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "boolean",            "optional": false,            "field": "test",            "description": "<p>Identifies test requests to the api. By default, set to true.</p>"          },          {            "group": "Parameter",            "type": "JSON[]",            "optional": false,            "field": "json",            "description": "<p>Array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?test=[test]&json=[json]",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "JSON",            "optional": false,            "field": "json",            "description": "<p>Location in JSON format.</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "GET api.iitrtclab.com/indoorLocation/getIndoorLocationJSON?test=true&json=[{\"Major\":101,\"Minor\":175,\"Rssi\":-91.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-92.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-93.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-80.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-83.0}]",        "type": "http"      }    ],    "permission": [      {        "name": "none"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationController.js",    "groupTitle": "IndoorLocation"  },  {    "type": "get",    "url": "/getIndoorLocationJSON?test=[test]&json=[json]",    "title": "Get indoor location in JSON format. MinRSSI and Least Squares algorithms.",    "description": "<p>The algorithms estimate the indoor location and coordinates taking as input the data from the iBeacons included in the request’s json parameter. The result returned by the API is in JSON format. Both parameters are mandatory in the request (test and json). The two algorithms (minRSSI and LeastSquared) are executed only in the case that data from at least 4 iBeacons is included in the request. This is for a reason of concept concerning the Least Squared algorithm. If the json input parameter shows information of 3 or less beacons, only the minRSSI algorithm is executed, and therefore no x, y coordinates are included in the API’s result. It is important to do the request to the API as shown in the example below, including Major, Minor and Rssi starting with capital letter. The LeastSquared algorithm is implemented to be case sensitive.</p>",    "name": "getIndoorLocationJSON",    "group": "IndoorLocation",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "boolean",            "optional": false,            "field": "test",            "description": "<p>Identifies test requests to the api. By default, set to true.</p>"          },          {            "group": "Parameter",            "type": "JSON[]",            "optional": false,            "field": "json",            "description": "<p>Array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?test=[test]&json=[json]",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "JSON",            "optional": false,            "field": "json",            "description": "<p>Location and x,y coordinates in JSON format.</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "GET api.iitrtclab.com/indoorLocation/getIndoorLocationJSON?test=true&json=[{\"Major\":101,\"Minor\":175,\"Rssi\":-91.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-92.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-93.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-80.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-83.0}]",        "type": "http"      }    ],    "permission": [      {        "name": "none"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationController.js",    "groupTitle": "IndoorLocation"  },  {    "type": "get",    "url": "/getIndoorLocationLeastSquared?json=[json]",    "title": "Get indoor location XML. Least Squares algorithm.",    "description": "<p>The algorithm calculates the coordinates taking as input the data from the iBeacons included in the request’s json parameter. The algorithm is only executed if data from at least 4 iBeacons is specified. This is for conceptual reasons concerning the Least Squared algorithm. Instead of the json parameter, it can be specified the test id (testid), for analysis purposes. One and only one of the following input parameters must be included in the request: json OR testid. The rest of the parameters related to testid are optional.</p>",    "name": "getIndoorLocationLeastSquared",    "group": "IndoorLocation",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "JSON[]",            "optional": false,            "field": "json",            "description": "<p>Array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "testid",            "description": "<p>flag used for analysis; it takes an integer input, which should be a valid test id. It returns a json output, with information needed to render the test’s results. The testid parameter accepts several parameters as options, which can be individually included or not: nbeacons, nfbeacons and proximity.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?json=[json]\n?testid=[testid]\n?testid=[testid]&nbeacons=[nbeacons]&nfbeacons=[nfbeacons]&proximity=[proximity]",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String[]",            "optional": false,            "field": "String[]",            "description": "<p>X and Y coordinates.</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "GET api.iitrtclab.com/indoorLocation/getIndoorLocationLeastSquared?json=[{\"Major\":101,\"Minor\":175,\"Rssi\":-91.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-92.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-93.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-80.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-83.0}]\nGET api.iitrtclab.com/indoorLocation/getIndoorLocationLeastSquared?testid=333\nGET api.iitrtclab.com/indoorLocation/getIndoorLocationLeastSquared?testid=333&nbeacons=5&nfbeacons=3&proximity=-70,5,-60,3,-50,2,-40,1",        "type": "http"      }    ],    "permission": [      {        "name": "none"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationController.js",    "groupTitle": "IndoorLocation"  },  {    "type": "get",    "url": "/getIndoorLocationMinRSSI?test=[test]&json=[json]",    "title": "Get indoor location XML. MinRSSI algorithm.",    "description": "<p>The algorithm estimates the indoor location taking as input the data from the iBeacons included in the request’s json parameter. The result returned is in XML PIDF-LO format. Both parameters are mandatory in the request (test and json).</p>",    "name": "getIndoorLocationMinRSSI",    "group": "IndoorLocation",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "boolean",            "optional": false,            "field": "test",            "description": "<p>Identifies test requests to the API. By default, set to true.</p>"          },          {            "group": "Parameter",            "type": "JSON[]",            "optional": false,            "field": "json",            "description": "<p>Includes an array of iBeacons, including for each one its Major, Minor and Rssi, in JSON format.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?test=true&json=[{\"Major\":101,\"Minor\":175,\"Rssi\":-91.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-92.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-93.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-80.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-83.0}]",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "XML",            "optional": false,            "field": "xml",            "description": "<p>Location in XML PIDF-LO format.</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "GET api.iitrtclab.com/indoorLocation/getIndoorLocationMinRSSI?test=true&json=[{\"Major\":101,\"Minor\":175,\"Rssi\":-91.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-92.0},{\"Major\":101,\"Minor\":175,\"Rssi\":-93.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-80.0},{\"Major\":101,\"Minor\":202,\"Rssi\":-83.0}]",        "type": "http"      }    ],    "permission": [      {        "name": "none"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationController.js",    "groupTitle": "IndoorLocation"  },  {    "type": "get",    "url": "/getMapPDF?building=[building]&floor=[floor]",    "title": "Get PDF map for building and floor.",    "description": "<p>Two parameters are needed in the request: building AND floor. Current building and floor maps available (July 2017): Alumni_Hall (AM-00, AM-01, AM-02) ; IT_Tower (IT-00-21) ; Life_Science_Building (LS-00, LS-01, LS-02, LS-03) ; Perlstein_Hall (PH-00, PH-01, PH-02) ; Rettaliata_Engineering_Center (E1-00, E1-01, E1-02) ; Siegel_Hall (SH-00, SH-01, SH-02, SH-03) ; Stuart_Building (SB-00, SB-01, SB-02) ; Wishnick_Hall (WH-00, WH-01, WH-02, WH-03) .</p>",    "name": "getMapPDF",    "group": "IndoorLocation",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "bulding",            "description": "<p>Building's name.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "floor",            "description": "<p>Building's floor (Acronym and number).</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?building=Alumni_Hall&floor=AM-00",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "PDF",            "optional": false,            "field": "map",            "description": "<p>Map for the specified building and floor.</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "GET api.iitrtclab.com/indoorLocation/getMapPDF?building=Alumni_Hall&floor=AM-00",        "type": "http"      }    ],    "permission": [      {        "name": "none"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationController.js",    "groupTitle": "IndoorLocation"  },  {    "type": "get",    "url": "/getMapPNG?building=[building]&floor=[floor]",    "title": "Get PNG map for building and floor..",    "description": "<p>Two parameters are needed in the request: building AND floor. Current building and floor maps available (July 2017): Alumni_Hall (AM-00, AM-01, AM-02) ; IT_Tower (IT-00-21) ; Life_Science_Building (LS-00, LS-01, LS-02, LS-03) ; Perlstein_Hall (PH-00, PH-01, PH-02) ; Rettaliata_Engineering_Center (E1-00, E1-01, E1-02) ; Siegel_Hall (SH-00, SH-01, SH-02, SH-03) ; Stuart_Building (SB-00, SB-01, SB-02) ; Wishnick_Hall (WH-00, WH-01, WH-02, WH-03) .</p>",    "name": "getMapPNG",    "group": "IndoorLocation",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "bulding",            "description": "<p>Building's name.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "floor",            "description": "<p>Building's floor (Acronym and number).</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "?building=Alumni_Hall&floor=AM-00",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "PNG",            "optional": false,            "field": "map",            "description": "<p>Map for the specified building and floor.</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "GET api.iitrtclab.com/indoorLocation/getMapPNG?building=Alumni_Hall&floor=AM-00",        "type": "http"      }    ],    "permission": [      {        "name": "none"      }    ],    "version": "1.0.0",    "filename": "api/controllers/IndoorLocationController.js",    "groupTitle": "IndoorLocation"  },  {    "type": "post",    "url": "/sergeantUpdate?json=[json]",    "title": "Store atmosphere data.",    "description": "<p>Api for sergeants' update. Configured in Webhook Particle so it calls the api regularly to make the updates. Allows to send atmosphere (temperature and humidity) data of a certain beacon, so it can be stored in the correspondent tables in the Indoor Location database schema (indoor_location_db). This API is specifically designed for its use by the Particle cloud service’s tool Webhook, which uses the API regularly to send the information received from the sergeants.</p>",    "name": "sergeantUpdate",    "group": "Management",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "JSON",            "optional": false,            "field": "json",            "description": "<p>Particular to the needs of the could service. It includes values for the MAC address of the beacon (mac), the temperature and humidity values (temp and humidity), as well as the voltage and battery of the device (voltage and battery), if reported.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "String",            "description": "<p>Success. &quot;success&quot;</p>"          }        ]      }    },    "permission": [      {        "name": "admin"      }    ],    "version": "1.0.0",    "filename": "api/controllers/ManagementController.js",    "groupTitle": "Management"  },  {    "type": "post",    "url": "/setBeacon?major=[major]&minor=[minor]&locId=[locId]",    "title": "Set or replace beacon.",    "description": "<p>Allows to change the location of a beacon to a certain location. The location of the beacon previously deployed in that location is set to null, which implies it is not deployed anymore. All the input parameters are mandatory in the request.</p>",    "name": "setBeacon",    "group": "Management",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "major",            "description": "<p>Major of the beacon.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "minor",            "description": "<p>Minor of the beacon.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "locId",            "description": "<p>Identifier of the beacon's new location.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "/setBeacon?major=2000&minor=577&locId=100",          "type": "String"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "String",            "description": "<p>Success. 'Success'</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "POST api.iitrtclab.com/management/setBeacon?major=2000&minor=577&locId=100",        "type": "http"      }    ],    "permission": [      {        "name": "admin"      }    ],    "version": "1.0.0",    "filename": "api/controllers/ManagementController.js",    "groupTitle": "Management"  }] });
