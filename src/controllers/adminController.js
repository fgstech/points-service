// controllers/adminController.js
const apiKeyService = require('../services/apiKeyService');

class AdminController {
    async generateUserApiKey(req, res) {
        try {
            const { userId, tenantId } = req.body;
            const keys = await apiKeyService.generateApiKey(tenantId, userId);
            res.status(201).json({ message: 'API Key generated', keys });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async listApiKeys(req, res) {
        try {
            const keys = await apiKeyService.getAllApiKeys();
            res.status(200).json(keys);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async ensureApiKey(req, res) {
        try {
            const { userId } = req.body;
            const keys = await apiKeyService.getOrCreateDefaultApiKey(userId);
            res.status(200).json({ message: 'API Key ensured', keys });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AdminController();