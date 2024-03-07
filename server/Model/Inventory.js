const mongoose = require('mongoose')


const itemSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        imageUrl: {
            type: String,
            default: ''
        },
        category:{
            type: String,
            enum: ['clothing', 'rackets', 'accessories'],
            require: true
        },
        stockQuantity:{
            type: Number,
        }
    }, { timestamps: true });

    const Items = mongoose.model('Items', itemSchema)

    module.exports = Items
