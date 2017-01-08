const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');


const Schema = new mongoose.Schema({
    userName: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    image: {type: String},
    token: {type: String},
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    favView: {type: Boolean},
    watchView: {type: Boolean},
    recentView: {type: Boolean},
    favList: [],
    watchList: [],
    recentList: [],
    likeList: [],
    year: "",
    country: {type: String},
    bio: {type: String}
});

Schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', Schema);