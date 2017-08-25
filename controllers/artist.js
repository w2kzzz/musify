'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getArtist(req, res){
	var artistId = req.params.id;

	Artist.findById(artistId, function(err, artist){
		if(err){
			res.status(500).send({message: 'Error getting the artist'});
		}else{
			if(!artist){
				res.status(404).send({message: 'Artist doesnt exist'});
			}else{
				res.status(200).send({artist});
			}
		}
	})
	//res.status(200).send({message: 'Test getArtist'});
}

function getArtists(req , res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
		if(err){
			res.status(500).send({message: 'Error trying to get artists'});
		}else{
			if(!artists){
				res.status(404).send({message: 'there are no artists'});
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artists
				});
			}
		}
	})
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

function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, function(err, artistUpdated){
		if(err){
			res.status(500).send({message: 'Error updating artist'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'Artist wasnt updated'});
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}
	});
}

function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, function(err, artistRemoved){
		if(err){
			res.status(500).send({message: 'Error deleting artist'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'Artist wasnt deleted'});
			}else{				

				Album.find({artist: artistRemoved._id}).remove(function(err, albumRemoved){
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
		}
	})
}

function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'not uploaded..';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			User.findByIdAndUpdate(artistId,{image: file_name}, function(err, artistUpdated){
				if(err){
					res.status(500).send({message: 'Error updating image'});
				}else{
					if(!artistUpdated){
						res.status(404).send({message: 'Image wasnt updated'});
					}else{
						res.status(200).send({artist: artistUpdated});
					}
				}
			})
		}

		console.log(file_path);
	}else{
		res.status(200).send({message: 'Image not uploaded'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/artists/'+imageFile;

	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message: 'Image doesnt exists'});
		}
	})
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};