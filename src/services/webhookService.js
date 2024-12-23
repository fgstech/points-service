// services/webhookService.js
const Webhook = require('../models/Webhook');
const axios = require('axios');

class WebhookService {
    async addWebhook(tenantId, walletId, url, events) {
        return Webhook.create({ tenantId, walletId, url, events });
    }

    async sendWebhook(tenantId, walletId, event, payload) {
        const webhooks = await Webhook.find({ tenantId, walletId, events: event });

        for (const webhook of webhooks) {
            try {
                await axios.post(webhook.url, payload);
            } catch (error) {
                console.error(`Failed to send webhook to ${webhook.url}:`, error.message);
            }
        }
    }

    async getAll(tenantId) {
        const webhooks = await Webhook.find({ tenantId });
        return webhooks;
    }

    async findByIdAndDelete(tenantId, id) {
        return await Webhook.deleteOne({ tenantId, _id: id });
    }
}

module.exports = new WebhookService();