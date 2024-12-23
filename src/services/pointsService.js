// services/pointsService.js
const pointsRepository = require('../repositories/pointsRepository');
const transactionRepository = require('../repositories/transactionRepository');
const webhookService = require('./webhookService');

const { v4: uuidv4 } = require('uuid');

class PointsService {

    async getAllWallets(tenantId) {
        return pointsRepository.findAllWallets(tenantId);
    }

    async getWalletByUserId(tenantId, userId) {
        return pointsRepository.findWalletByUserId(tenantId, userId);
    }

    async getWalletById(tenantId, walletId) {
        return pointsRepository.findWalletById(tenantId, walletId);
    }

    async createWallet(tenantId, userId) {
        const existingWallet = await pointsRepository.findUserPoints(tenantId, userId);
        if (existingWallet) {
            throw new Error('Wallet already exists for this user');
        }
        const newWallet = await pointsRepository.createUserPoints(tenantId, userId, 0);
        return newWallet;
    }

    async createSystemWallet() {
        const tenantId = "system_wallet";
        const existingWallet = await pointsRepository.findUserPoints(tenantId, "system_wallet");
        if (!existingWallet) {
            await pointsRepository.createUserPoints(tenantId, "system_wallet", 0);
            console.log("System wallet created successfully.");
        }
    }

    async addPoints(tenantId, body) {
        const { userId, points, description = 'Points added' } = body;

        let user = await pointsRepository.findUserPoints(tenantId, userId);
        if (!user) {
            user = await pointsRepository.createUserPoints(tenantId, userId, points);
        } else {
            user = await pointsRepository.updateUserPoints(tenantId, userId, user.points + points);
        }

        await transactionRepository.createTransaction(tenantId, {
            transactionId: uuidv4(),
            userId,
            type: 'add',
            points,
            description,
            timestamp: new Date()
        });

        await webhookService.sendWebhook(tenantId, userId, 'received', { userId, points, newBalance, action: "add" });
        return user.points;
    }

    async redeemPoints(tenantId, userId, points, description = 'Points redeemed') {
        const user = await pointsRepository.findUserPoints(tenantId, userId);
        if (!user || user.points < points) throw new Error('Not enough points to redeem');

        user = await pointsRepository.updateUserPoints(tenantId, userId, user.points - points);

        await transactionRepository.createTransaction(tenantId, {
            transactionId: uuidv4(),
            userId,
            type: 'redeem',
            points,
            description,
            timestamp: new Date()
        });

        await webhookService.sendWebhook(tenantId, userId, 'spent', { userId, points, newBalance, action: "redeem" });
        return user.points;
    }

    async transferPoints(tenantId, fromUserId, toUserId, points) {
        const fromUser = await pointsRepository.findUserPoints(tenantId, fromUserId);
        const toUser = await pointsRepository.findUserPoints(tenantId, toUserId);

        if (!fromUser || !toUser) throw new Error('Both users must have a wallet');
        if (fromUser.points < points) throw new Error('Insufficient points for transfer');

        // Deduct points from sender
        await pointsRepository.updateUserPoints(tenantId, fromUserId, fromUser.points - points);
        // Add points to receiver
        await pointsRepository.updateUserPoints(tenantId, toUserId, toUser.points + points);

        // Log transactions for both users
        await transactionRepository.createTransaction(tenantId, {
            transactionId: uuidv4(),
            userId: fromUserId,
            type: 'transfer',
            points: -points,
            description: `Transfer to user ${toUserId}`,
            timestamp: new Date()
        });

        await transactionRepository.createTransaction(tenantId, {
            transactionId: uuidv4(),
            userId: toUserId,
            type: 'receive',
            points: points,
            description: `Received from user ${fromUserId}`,
            timestamp: new Date()
        });

        // Send webhook to notify the sender about the transfer
        await webhookService.sendWebhook(tenantId, fromUserId, 'spent', { fromUserId, toUserId, points, newBalance: fromUser.points, action: "transfer" });

        // Send webhook to notify the receiver about the incoming points
        await webhookService.sendWebhook(tenantId, toUserId, 'received', { fromUserId, toUserId, points, newBalance: toUser.points, action: "received" });

        return { fromUserBalance: fromUser.points - points, toUserBalance: toUser.points + points };
    }

    async purchaseTransaction(tenantId, userId, points, description = 'Purchase') {
        const user = await pointsRepository.findUserPoints(tenantId, userId);
        const systemWallet = await pointsRepository.findUserPoints(tenantId, "system_wallet");

        if (!user) throw new Error('User wallet not found');
        if (!systemWallet) throw new Error('System wallet not found');
        if (user.points < points) throw new Error('Insufficient points for purchase');

        // Deduct points from user's wallet
        user.points -= points;
        await pointsRepository.updateUserPoints(tenantId, userId, user.points);

        // Add points to the system wallet
        systemWallet.points += points;
        await pointsRepository.updateUserPoints(tenantId, "system_wallet", systemWallet.points);

        // Log transaction for user (purchase)
        await transactionRepository.createTransaction(tenantId, {
            transactionId: uuidv4(),
            userId,
            type: 'purchase',
            points: -points,
            description,
            timestamp: new Date()
        });

        // Log transaction for system wallet (receipt)
        await transactionRepository.createTransaction(tenantId, {
            transactionId: uuidv4(),
            userId: "system_wallet",
            type: 'receipt',
            points: points,
            description: `Received from user ${userId}`,
            timestamp: new Date()
        });

        await webhookService.sendWebhook(tenantId, userId, 'spent', { userId, points, newBalance: user.points, description, action: "purchase" });

        return user.points;
    }

    async purchaseTransactionBetweenUsers(tenantId, buyerId, sellerId, points, description = 'Purchase between users') {
        const buyer = await pointsRepository.findUserPoints(tenantId, buyerId);
        const seller = await pointsRepository.findUserPoints(tenantId, sellerId);

        if (!buyer) throw new Error('Buyer wallet not found');
        if (!seller) throw new Error('Seller wallet not found');
        if (buyer.points < points) throw new Error('Insufficient points for purchase');

        // Deduct points from buyer's wallet
        buyer.points -= points;
        await pointsRepository.updateUserPoints(tenantId, buyerId, buyer.points);

        // Add points to seller's wallet
        seller.points += points;
        await pointsRepository.updateUserPoints(tenantId, sellerId, seller.points);

        // Log transaction for buyer (purchase)
        await transactionRepository.createTransaction(tenantId, {
            transactionId: uuidv4(),
            userId: buyerId,
            type: 'purchase',
            points: -points,
            description: `Purchase from ${sellerId}`,
            timestamp: new Date()
        });

        // Log transaction for seller (receipt)
        await transactionRepository.createTransaction(tenantId, {
            transactionId: uuidv4(),
            userId: sellerId,
            type: 'sale',
            points: points,
            description: `Sale to ${buyerId}`,
            timestamp: new Date()
        });

        // Send webhook to notify the buyer about the purchase
        await webhookService.sendWebhook(tenantId, buyerId, 'spent', { buyerId, sellerId, points, newBalance: buyer.points, description, action: "purchase" });

        // Send webhook to notify the seller about the received points
        await webhookService.sendWebhook(tenantId, sellerId, 'received', { buyerId, sellerId, points, newBalance: seller.points, description, action: "sale" });

        return { buyerBalance: buyer.points, sellerBalance: seller.points };
    }

    async getTransactionHistory(tenantId, userId) {
        return transactionRepository.findTransactionsByUserId(tenantId, userId);
    }

    async getTotalCirculatingPoints(tenantId) {
        const result = await pointsRepository.calculateTotalPoints(tenantId);
        return result[0]?.totalPoints || 0;
    }
}

module.exports = new PointsService();