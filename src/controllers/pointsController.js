const pointsService = require('../services/pointsService');

class PointsController {
    async createWallet(req, res) {
        try {
            const { tenantId, body } = req;
            const { userId } = body;
            const wallet = await pointsService.createWallet(tenantId, userId);
            res.status(201).json({ message: 'Wallet created', wallet });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async addPoints(req, res) {
        try {
            const { tenantId, body } = req;
            const newBalance = await pointsService.addPoints(tenantId, body);
            res.status(200).json({ message: 'Points added', balance: newBalance });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async redeemPoints(req, res) {
        try {
            const { tenantId, body } = req;
            const { userId, points } = body;
            const newBalance = await pointsService.redeemPoints(tenantId, userId, points);
            res.status(200).json({ message: 'Points redeemed', balance: newBalance });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async transferPoints(req, res) {
        try {
            const { tenantId, body } = req;
            const { fromUserId, toUserId, points } = body;
            const result = await pointsService.transferPoints(tenantId, fromUserId, toUserId, points);
            res.status(200).json({ message: 'Transfer successful', balances: result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async purchaseTransaction(req, res) {
        try {
            const { tenantId, body } = req;
            const { userId, points, description } = body;
            const newBalance = await pointsService.purchaseTransaction(tenantId, userId, points, description);
            res.status(200).json({ message: 'Purchase transaction successful', balance: newBalance });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async purchaseTransactionBetweenUsers(req, res) {
        try {
            const { tenantId, body } = req;
            const { buyerId, sellerId, points, description } = body;
            const result = await pointsService.purchaseTransactionBetweenUsers(tenantId, buyerId, sellerId, points, description || 'Purchase between users');
            res.status(200).json({
                message: 'Purchase transaction successful',
                buyerBalance: result.buyerBalance,
                sellerBalance: result.sellerBalance
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllWallets(req, res) {
        try {
            const { tenantId } = req;
            const wallets = await pointsService.getAllWallets(tenantId);
            res.status(200).json(wallets);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getWalletById(req, res) {
        try {
            const { tenantId, params } = req;
            const { id } = params;
            const wallet = await pointsService.getWalletById(tenantId, id);
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }
            res.status(200).json(wallet);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getWalletByUserId(req, res) {
        try {
            const { tenantId, params } = req;
            const { userId } = params;
            const wallet = await pointsService.getWalletByUserId(tenantId, userId);
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }
            res.status(200).json(wallet);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getTransactionHistory(req, res) {
        try {
            const { tenantId, params } = req;
            const { userId } = params;
            const history = await pointsService.getTransactionHistory(tenantId, userId);
            res.status(200).json(history);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getTotalCirculatingPoints(req, res) {
        try {
            const { tenantId } = req;
            const totalPoints = await pointsService.getTotalCirculatingPoints(tenantId);
            res.status(200).json({ totalCirculatingPoints: totalPoints });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new PointsController();