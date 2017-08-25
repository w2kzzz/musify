'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getAlbum(req, res){
	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'artist'}).exec(function(err, album){
		if(err){
			res.status(500).send({message: 'Error trying to get album'});
		}else{
			if(!album){
				res.status(404).send({message: 'album doesnt exist'});
			}else{
				res.status(200).send({album});
			}
		}
	})
		
}

function getAlbums(req, res){
	var artistId = req.params.artist;

	if(!artistId){
		var find = Album.find({}).sort('title');
	}else{
		var find = Album.find({artist: artistId}).sort('year');
	}

	find.populate({path: 'artist'}).exec(function(err, albums){
		if(err){
			res.status(500).send({message: 'Error getting albums'});
		}else{
			if(!albums){
				res.status(404).send({message: 'there are no albums'});
			}else{
				res.status(200).send({albums});
			}
		}
	})
}

function saveAlbum(req, res){
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	if(album.title != null && album.description != null && album.year != null && album.artist != null){
		album.save(function(err, albumStored){
			if(err){
				res.status(500).send({message: 'Error saving album'});
			}else{
				if(!albumStored){
					res.status(404).send({message: "Album wasnt saved"});
				}else{
					res.status(200).send({album: albumStored});
				}
			}
		});
	}else{
		res.status(200).send({message: 'Missing information'});
	}
}

function updateAlbum(req, res){
	var albumId = req.params.id;

	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, function(err, albumUpdated){
		if(err){
			res.status(500).send({message: 'Error Updating Album'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: 'Album doesnt exists'});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}
	})
}

module.exports =  {
	getAlbum,
	getAlbums,
	saveAlbum,
	updateAlbum
};