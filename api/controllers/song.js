'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getSong(req, res){
	var songId = req.params.id;

	Song.findById(albumId).populate({path: 'artist'}).exec(function(err, song){
		if(err){
			res.status(500).send({message: 'Error trying to get song'});
		}else{
			if(!song){
				res.status(404).send({message: 'song doesnt exist'});
			}else{
				res.status(200).send({song});
			}
		}
	})
		
}

function getSongs(req, res){
	var albumId = req.params.album;

	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({
		path: 'album',
		populate: {
			path: artist,
			model: 'Artist'
		}
	}).exec(function(err, songs){
		if(err){
			res.status(500).send({message: 'Error getting songs'});
		}else{
			if(!songs){
				res.status(404).send({message: 'There are no songs'});
			}else{
				res.status(200).send({songs});
			}
		}
	})
}

function saveSong(req, res){
	var song = new Song();

	var params = req.body;
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save(function(err, songStored){
		if(err){
			res.status(500).send({message: 'Error trying to save song'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'Song wasnt saved'});
			}else{
				res.status(200).send({song: songStored});
			}
		}
	})
}

function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, function(err, songUpdated){
		if(err){
			res.status(500).send({message: 'Error updating song'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'song to update doesnt exist'});
			}else{
				res.status(200).send({song: songUpdated});
			}
		}
	})
}

function deleteSong(req, res){
	var songId = res.params.id;

	Song.findByIdAndRemove(songId, function(err, songDeleted){
		if(err){
			res.status(500).send({message: 'Error deleting song'});
		}else{
			if(!songDeleted){
				res.status(404).send({message: 'song to delete doesnt exist'});
			}else{
				res.status(200).send({song: songDeleted});
			}
		}
	})
}

function uploadSong(req, res){
	var songId = req.params.id;
	var file_name = 'not uploaded..';

	if(req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'mp3' || file_ext == 'ogg'){
			Song.findByIdAndUpdate(songId,{file: file_name}, function(err, songUpdated){
				if(err){
					res.status(500).send({message: 'Error uploading song'});
				}else{
					if(!songUpdated){
						res.status(404).send({message: 'Song wasnt updated'});
					}else{
						res.status(200).send({song: songUpdated});
					}
				}
			})
		}

	}else{
		res.status(200).send({message: 'Song not uploaded'});
	}
}

function getSongFile(req, res){
	var songFile = req.params.songFile;
	var pathFile = './uploads/songs/'+songFile;

	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message: 'Song doesnt exists'});
		}
	})
}

module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	uploadSong,
	getSongFile
}