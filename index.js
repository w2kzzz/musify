'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977

mongoose.connect('mongodb://localhost:27017/musify', {useMongoClient: true} , function(err, res){
	if(err){
		throw err;
	}else{
		console.log("Database Running correctly..");

		app.listen(port, function(){
			console.log("REST API Server Running...");
		})
	}
});