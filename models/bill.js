// bill.model.js
const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    customerName: String,
    items: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        quantity: Number,
        price: Number 
    }],
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);

