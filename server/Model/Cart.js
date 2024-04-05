const mongoose = require('mongoose');

// Schema for individual cart items
const cartItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Items', // Ensure this matches the name given in mongoose.model() for the Item model
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
    min: 1, // Ensure quantity is always positive
  },
});

// Schema for the cart
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model to track which cart belongs to which user
    require: true,
  },
  items: [cartItemSchema], // An array of items in the cart
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
