const mongoose = require('mongoose');

const Cart = mongoose.model(
    'Cart', 
    new mongoose.Schema({
        products: [{ type: String }],
        createdAt: Date
    })
);

module.exports = typeCart;