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

function deleteAlbum(req, res){
	var albumId = req.params.id;

	Album.findByIdAndRemove({albumId}).remove(function(err, albumRemoved){
		if(err){
			res.status(500).send({message: 'Error deleting album'});
		}else{
			if(!albumRemoved){
				res.status(404).send({message: 'Album wasnt deleted'});
			}else{
				Song.find({album: albumRemoved._id}).remove(function(err, songRemoved){
					if(err){
						res.status(500).send({message: 'Error deleting song'});
					}else{
						if(!songRemoved){
							res.status(404).send({message: 'Song wasnt deleted'});
						}else{
							res.status(200).send({artist: artistRemoved});
						}
					}
				})
			}
		}
	});
}

function uploadImage(req, res){
	var albumId = req.params.id;
	var file_name = 'not uploaded..';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg'){
			Album.findByIdAndUpdate(albumId,{image: file_name}, function(err, albumUpdated){
				if(err){
					res.status(500).send({message: 'Error updating image'});
				}else{
					if(!albumUpdated){
						res.status(404).send({message: 'Image wasnt updated'});
					}else{
						res.status(200).send({album: albumUpdated});
					}
				}
			})
		}

	}else{
		res.status(200).send({message: 'Image not uploaded'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/albums/'+imageFile;

	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message: 'Image doesnt exists'});
		}
	})
}


module.exports =  {
	getAlbum,
	getAlbums,
	saveAlbum,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
};