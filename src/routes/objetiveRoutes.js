// routes/pointsRoutes.js
const express = require('express');
const router = express.Router();
const objetiveController = require('../controllers/objetiveController');

router.post('/objetive/create', objetiveController.create); // crear wallet
router.get('/objetive', objetiveController.find);
router.get('/objetive/:id', objetiveController.findById);
router.put('/objetive/:id', objetiveController.update);
router.delete('/objetive/:id', objetiveController.remove);

module.exports = router;