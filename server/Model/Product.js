const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    expectedHarvestDate: {
        type: Date,
        required: true
    },
    estimatedQuantity: {
        type: Number,
        required: true
    },
    availableQuantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'available', 'sold'],
        default: 'upcoming'
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema); 