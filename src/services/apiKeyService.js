// services/apiKeyService.js
const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');

class ApiKeyService {
    async generateApiKey(tenantId, userId) {
        const apiKey = crypto.randomBytes(16).toString('hex');
        const secretKey = crypto.randomBytes(32).toString('hex');

        const newKey = await ApiKey.create({ tenantId, userId, apiKey, secretKey });
        return { apiKey: newKey.apiKey, secretKey: newKey.secretKey };
    }

    async validateApiKey(tenantId, apiKey, secretKey) {
        const keyRecord = await ApiKey.findOne({ tenantId, apiKey, secretKey });
        return !!keyRecord; // Devuelve true si las claves son válidas, false de lo contrario
    }

    async getOrCreateDefaultApiKey(tenantId, userId) {
        let keyRecord = await ApiKey.findOne({ userId });

        if (!keyRecord) {
            const apiKey = crypto.randomBytes(16).toString('hex');
            const secretKey = crypto.randomBytes(32).toString('hex');
            keyRecord = await ApiKey.create({ tenantId, userId, apiKey, secretKey });
        }

        return { apiKey: keyRecord.apiKey, secretKey: keyRecord.secretKey };
    }

    async initializeDefaultApiKey() {
        const defaultUserId = 'default_system_user';
        const tenantId = defaultUserId;
        const existingKey = await ApiKey.findOne({ tenantId, userId: defaultUserId });

        if (!existingKey) {
            console.log('No default API Key found. Generating one...');
            const keys = await this.getOrCreateDefaultApiKey(tenantId, defaultUserId);
            console.log('Default API Key and Secret Key created:', keys);
        } else {
            console.log('Default API Key already exists.');
        }
    }

    async getAllApiKeys() {
        return await ApiKey.find();
    }
}

module.exports = new ApiKeyService();