/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

 module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
// Main route
'/': {
  view: 'index'
},
'GET /authentication': 'AuthenticationController.login',
'GET /logout': 'AuthenticationController.logout',
'/documentation': {
  view: 'documentation'
},
'/projects_and_publications': {
  view: 'projects_and_publications'
},

'GET /atmosphere/getAtmosphere': 'AtmosphereController.getAtmosphere',
'GET /atmosphere/getAtmosphereOldDb': 'AtmosphereController.getAtmosphereOldDb',

'GET /indoorLocation/test': 'IndoorLocationController.test',
'GET /indoorLocation/actionX': 'IndoorLocationController.actionX',
'GET /indoorLocation/bye': 'IndoorLocationController.bye',
'GET /indoorLocation/getMap': 'IndoorLocationController.getMap',
'GET /indoorLocation/getMapPDF': 'IndoorLocationController.getMapPDF',
'GET /indoorLocation/getMapPNG': 'IndoorLocationController.getMapPNG',
'GET /indoorLocation/getIndoorLocation': 'IndoorLocationController.getIndoorLocation',
'GET /indoorLocation/getIndoorLocationMinRSSI': 'IndoorLocationController.getIndoorLocationMinRSSI',
'GET /indoorLocation/getIndoorLocationLeastSquared': 'IndoorLocationController.getIndoorLocationLeastSquared',
'GET /indoorLocation/getIndoorLocationJSON': 'IndoorLocationController.getIndoorLocationJSON',
'GET /indoorLocation/getIndoorLocationCivicAddressJSON': 'IndoorLocationController.getIndoorLocationCivicAddressJSON',

'POST /indoorLocationTest/createTestEvent': 'IndoorLocationTestController.createTestEvent',
'GET /indoorLocationTest/getTesterLocationID': 'IndoorLocationTestController.getTesterLocationID',
'POST /indoorLocationTest/storeTestData': 'IndoorLocationTestController.storeTestData',

'POST /management/setBeacon': 'ManagementController.setBeacon',
'POST /management/sergeantUpdate': 'ManagementController.sergeantUpdate',
'POST /management/sergeantUpdateTest': 'ManagementController.sergeantUpdateTest',
'GET /management/sergeantUpdateTest': 'ManagementController.sergeantUpdateTest',

'/webrtc':{
  view:'ps-webrtc-peerjs-final'
},

// Example routes' format for future developments

  // 'post /indoorLocation/test':{
  //   controller: 'IndoorLocationController',
  //   action: 'test'
  // },

  // 'get /indoorLocation/getAtmosphere':{
  //   controller: 'IndoorLocationController',
  //   action: 'getAtmosphere'
  // },

  // 'get /sql': 'IndoorLocationController.getAtmosphere',



  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
