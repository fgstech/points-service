// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/webhooks', webhookController.addWebhook);
router.get('/webhooks/:walletId', webhookController.listWebhooks);
router.delete('/webhooks/:id', webhookController.deleteWebhook);

module.exports = router;