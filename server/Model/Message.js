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
},{timestamps: true});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;