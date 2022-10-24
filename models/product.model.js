const mongoose = require('mongoose');

const typeProduct = mongoose.model(
    'Products',
    new mongoose.Schema({
        name: String,
        category: String,
        price: Number,
        img: String
    })
);

module.exports = typeProduct;