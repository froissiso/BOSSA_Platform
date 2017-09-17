/**
 * FrontendController
 *
 * @description :: Server-side logic for managing Indoorlocationfrontends
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// FRONT-END apis

	signin: function(req,res){
	},
	labWebsite: function(req,res){
		res.redirect('https://appliedtech.iit.edu/rtc-lab');
	},
	documentation: function(req,res){
		// console.log("Testing resources link");
		res.view('static/documentation.ejs');
	},
	publications: function(req,res){
		res.view('static/resources.ejs');
	},
	managementServer: function(req,res){

	},
};

