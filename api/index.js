'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 8080

mongoose.connect('mongodb://localhost:27017/musify', {useMongoClient: true} , function(err, res){
	if(err){
		throw err;
	}else{
		console.log("Database Running correctly..");

		app.listen(port, function(err){
			if(err){
				console.log('Error listening the port');
			}else{
				console.log("REST API Server Running...");
			}
		})
	}
});