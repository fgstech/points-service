// models/Transaction.js
const mongoose = require('mongoose');

class Transaction extends mongoose.Model {
    static schema = new mongoose.Schema({
        tenantId: { type: String, required: true },
        transactionId: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        type: { type: String, enum: ['add', 'redeem','transfer','receive','purchase', 'receipt'], required: true },
        points: { type: Number, required: true },
        description: { type: String },
        timestamp: { type: Date, default: Date.now }
    });
}

module.exports = mongoose.model('Transaction', Transaction.schema);