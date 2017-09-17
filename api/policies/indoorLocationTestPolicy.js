module.exports = function indoorLocationTestPolicy (req, res, next){
	var pass = req.param('pass');
	if(pass == '1234'){
		return next();
	}
	else{
		auth_error = "Please, include authentication parameters to use this API."
		return res.send(auth_error);
	}
}