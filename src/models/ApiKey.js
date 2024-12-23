// models/ApiKey.js
const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    userId: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true },
    secretKey: { type: String, required: true }
});

module.exports = mongoose.model('ApiKey', apiKeySchema);