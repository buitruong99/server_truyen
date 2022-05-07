const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type: 'string',
        require: true,
        minLength: 1,
        maxLength: 20,
        unique: true
    },
    email: {
        type: 'string',
        require: true,
        minLength: 5,
        maxLength: 50,
        unique: true
    },
    password: {
        type: 'string',
        require: true,
        minLength: 1,
    },
    admin:{
        type: 'boolean',
        default: false,

    }
},{timestamps: true})

module.exports = mongoose.model("User", userSchema)