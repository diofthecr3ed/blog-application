const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `A user must have a display name.`],
        trim: true,
        unique: true 
    },
    email: {
        type: String,
        required: [true, `Email is required.`],
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Enter a valid email']
    },
    role: {
        type: String,
        enum: ['user' , 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, `A password is required.`],
        minlength: [8, 'A password should be minimum 8 character length'],
        select: false 
    }

});

const User = mongoose.model('user_data', userSchema);

module.exports = User;