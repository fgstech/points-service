// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Ruta para generar una nueva API Key para un usuario
router.post('/admin/generate-api-key', adminController.generateUserApiKey);
router.get('/admin/list-api-keys', adminController.listApiKeys);


module.exports = router;