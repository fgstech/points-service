// models/Webhook.js
const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    walletId: { type: String, required: true },
    url: { type: String, required: true },
    events: [{ type: String, enum: ['received', 'spent', 'expiry'] }]
});

module.exports = mongoose.model('Webhook', webhookSchema);