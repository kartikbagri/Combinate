// Importing Modules
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    googleId: {
        type: String,
    },
    profilePic: {
        type: String,
        default: '/images/profilePic.jpeg'
    },
    codingSites: {
        type: [String],
        default: ['codeforces']
    },
    bio: {
        type: String
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    interests: {
        type: [String]
    },
    categories: {
        type: [String]
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

userSchema.statics.findOrCreate = async function(query) {
    const queryId = query.id;
    const queryEmail = query.emails[0].value;
    var foundUser = await this.findOne({googleId: queryId})
    .catch(err => err);
    if(foundUser) {
        return {err: null, currentUser: foundUser};
    }
    foundUser = await this.findOne({email: queryEmail})
    .catch(err => err);
    if(foundUser) {
        foundUser = await this.findByIdAndUpdate(foundUser._id, {googleId: queryId}, {new: true})
        .catch(err => err);
        return {err: null, currentUser: foundUser};
    }
    const newUserInfo = {
        name: query.displayName,
        googleId: query.id,
        email: query.emails[0].value,
        profilePic: query.photos[0].value,
        username: query.id
    }
    const newUser = new User(newUserInfo);
    foundUser = await newUser.save()
    .catch(err => err);
    return {err: null, currentUser: foundUser};
}

// Plugin Passport-local-mongoose into User Schema
userSchema.plugin(passportLocalMongoose, {usernameQueryFields: ['email']});

const User = mongoose.model('User', userSchema);

module.exports = User;