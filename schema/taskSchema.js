// Importing Modules
const mongoose = require('mongoose');

// User Schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isCollaborative: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    collaborators: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },
    category: {
        type: String
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;