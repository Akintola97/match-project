const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       require: true
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    content:{
        type: String, 
        require: true
    },
    timestamp:{
        type: Date,
        default: Date.now,
        require:true
    }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;