const mongoose = require('mongoose')

module.exports = new mongoose.model('Users', {
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: String,
    age: Number,
    adress: String,
    phone: Number,
    img: {},
    cart: [{
        _id: { type: String },
        name: { type: String },
        price: { type: Number },
        img: { type: String }
    }]
})