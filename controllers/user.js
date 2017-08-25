'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function test(req, res){
	res.status(200).send({
		message: 'Testing action of controller for the API REST with NODE.js and MongoDB'
	});
}

function saveUser(req,res){
	var user = new User;

	var params = req.body;

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		bcrypt.hash(params.password, null, null, function(err, hash) {
			user.password = hash;

			if(user.name != null && user.surname != null && user.email != null){
				user.save(function (err, userStored) {
					if(err){
						res.status(500).send({
							message: 'There was an ERROR saving the user'});
					}else{
						if(!userStored){
							res.status(404).send({
								message: 'User not saved correctly'});
						}else{
							res.status(200).send({
								message: userStored});
						}
					}
				})
			}else{
				res.status(200).send({
					message: 'One or more values are missing'});
			}
		})
	}else{
		res.status(200).send({
			message: 'Introduce the Password'});
	}
}

function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, function(err, user) {
		if(err){
			res.status(500).send({
				message: 'There was an ERROR with the request'});
		}else{
			if(!user){
				res.status(404).send({
					message: 'User doesnt exist'});
			}else{
				//compare password
				bcrypt.compare(password, user.password, function(err, check){
					if (check){
						// return user data
						if(params.gethash){
							//return jwt token
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({
							message: 'Incorrect Password'});
					}
				});
			}
		}
	})
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, function(err, userUpdated){
		if(err){
			res.status(500).send({message: 'Error updating user'});
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'User wasnt updated'});
			}else{
				res.status(200).send({user: updateUser});
			}
		}
	})
}

function uploadImage(req,res){
	var userId = req.params.id;
	var file_name = 'not uploaded..';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			User.findByIdAndUpdate(userId,{image: file_name}, function(err, userUpdated){
				if(err){
					res.status(500).send({message: 'Error updating image'});
				}else{
					if(!userUpdated){
						res.status(404).send({message: 'Image wasnt updated'});
					}else{
						res.status(200).send({user: userUpdated});
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
	var pathFile = './uploads/users/'+imageFile;

	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile));
		}else{
			res.status(200).send({message: 'Image doesnt exists'});
		}
	})
}

module.exports = {
	test,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};