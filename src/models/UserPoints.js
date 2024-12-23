// models/UserPoints.js
const mongoose = require('mongoose');

class UserPoints extends mongoose.Model {
    static schema = new mongoose.Schema({
        tenantId: { type: String, required: true },
        userId: { type: String, required: true, unique: true },
        points: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now }
    });
}

module.exports = mongoose.model('UserPoints', UserPoints.schema);