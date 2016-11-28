var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var options = {
    personModelName:            'User',
    friendshipModelName:        'Relationships',
    friendshipCollectionName:   'userRelationships',
};

var friendsOfFriends = require('friends-of-friends')(mongoose, options);

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	fname: {
		type: String
	},
	sname: {
		type: String
	},
	connected: {
		type: Boolean,
		default: false
	},
	friends: [
		{
			fname: String,
			sname: String
		}
	]
});

UserSchema.plugin(friendsOfFriends.plugin, options);

var User = module.exports = mongoose.model(options.personModelName, UserSchema)

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}
