const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       require: true
    },
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    text:{
        type: String, 
        require: true
    },
    read: {
        type: Boolean,
        default: false // New field to track if a message has been read
    },
},{timestamps: true});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
