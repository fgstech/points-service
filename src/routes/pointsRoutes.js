// routes/pointsRoutes.js
const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/pointsController');

router.post('/wallet/create', pointsController.createWallet); // crear wallet
router.get('/wallets', pointsController.getAllWallets);
router.get('/wallet/:id', pointsController.getWalletById);
router.get('/wallet/user/:userId', pointsController.getWalletByUserId);

router.get('/points/total', pointsController.getTotalCirculatingPoints);
router.post('/points/add', pointsController.addPoints); // agregar puntos
router.post('/points/redeem', pointsController.redeemPoints); // quitar punetos
router.post('/points/transfer', pointsController.transferPoints); // tranferir puntos entre usuarios
router.post('/points/purchase', pointsController.purchaseTransaction); // 
router.post('/points/purchase/between-users', pointsController.purchaseTransactionBetweenUsers);

router.get('/transactions/user/:userId', pointsController.getTransactionHistory);

module.exports = router;