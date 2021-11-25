// Importing Modules
const mongoose = require('mongoose');

// Chat Schema
const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    chatMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    chatMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;