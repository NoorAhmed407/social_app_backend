const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: ''
    },
});

const User = mongoose.model('Users', userSchema);


module.exports = User;