const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    content:{
        type: String,
        maxlength: 1000,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true,
            maxlength: 300,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }]
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema);