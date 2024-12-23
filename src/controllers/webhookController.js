// controllers/webhookController.js
const webhookService = require('../services/webhookService');

class WebhookController {
    async addWebhook(req, res) {
        try {
            const { tenantId, body } = req;
            const { walletId, url, events } = body;
            const webhook = await webhookService.addWebhook(tenantId, walletId, url, events);
            res.status(201).json({ message: 'Webhook added', webhook });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async listWebhooks(req, res) {
        try {
            const { tenantId } = req;
            const webhooks = await webhookService.getAll(tenantId);
            res.status(200).json(webhooks);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteWebhook(req, res) {
        try {
            const { tenantId, params } = req;
            const { id } = params;
            await webhookService.findByIdAndDelete(tenantId, id);
            res.status(200).json({ message: 'Webhook deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new WebhookController();