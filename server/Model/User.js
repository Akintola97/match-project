const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    firstName: {
        type: String, 
        require: true,
    },

    password:{
        type: String, 
        require: true, 
    },
    email: {
        type: String, 
        require: true, 
        unique: true
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    message:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]

}, {timestamps: true});


const User = mongoose.model('User', userSchema)

module.exports = User;