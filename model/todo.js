const { string } = require('joi');
let mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        minlength: 3,
        maxlength: 20
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },
    username: {
        type: String,
        require: true
    },
    uid: {
        type: String,
        require: true
    }
});
const Task = mongoose.model("Task", TaskSchema);
module.exports = { Task };