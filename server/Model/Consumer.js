const mongoose = require("mongoose");

const ConsumerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['supermarket', 'restaurant', 'healthcare', 'food processing', 'Events', 'ngo'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Consumer', ConsumerSchema); 