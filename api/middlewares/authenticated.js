'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'musify-secret';

exports.ensureAuth = function(req, res, next){
	if(!req.headers.authorization){
		return res.status(403).send({message: 'Authorization Header is not present'});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');

	try{
		var payload = jwt.decode(token, secret);

		if(payload.exp <= moment().unix()){
			return res.status(401).send({message: 'Token is expired'});
		}
	}catch(ex){
		console.log(ex);
		return res.status(404).send({message: 'Invaid Token'});
	}

	req.user = payload;

	next();
};