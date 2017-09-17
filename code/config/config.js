var config = {
	development: {
	    //mySQL connection settings
	    database: {
	    	host: "accesspointlocationserver.cbkzo1niupv4.us-east-1.rds.amazonaws.com",
			user: "neil",
			password: "neilpassword",
			database: "indoor_location_db"
	    },
	    database_test: {
	    	host: "accesspointlocationserver.cbkzo1niupv4.us-east-1.rds.amazonaws.com",
			user: "neil",
			password: "neilpassword",
			database: "testing_application_db"
	    }
	},
	production: {
	    //mySQL connection settings
	    database: {
			host: "accesspointlocationserver.cbkzo1niupv4.us-east-1.rds.amazonaws.com",
			user: "neil",
			password: "neilpassword",
			database: "indoor_location_db"
	    },
	}
};

module.exports = config;
