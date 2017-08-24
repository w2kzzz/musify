'use strict'

var path = require('path');
var fs = require('fs');

var Atist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
	res.status(200).send({message: 'Test getArtist'});
}

function saveArtist(req, res){
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save(function(err, artistStored){
		if(err){
			res.status(500).send({message: 'Error saving the artist'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'Artist not saved correctly'});
			}else{
				res.status(200).send({artist: artistStored});
			}
		}
	})
}

module.exports = {
	getArtist,
	saveArtist
};