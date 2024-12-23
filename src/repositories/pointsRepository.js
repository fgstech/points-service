// repositories/pointsRepository.js
const UserPoints = require('../models/UserPoints');

class PointsRepository {
    async findUserPoints(tenantId, userId) {
        return UserPoints.findOne({ tenantId, userId });
    }

    async createUserPoints(tenantId, userId, points) {
        return UserPoints.create({ tenantId, userId, points });
    }

    async updateUserPoints(tenantId, userId, points) {
        return UserPoints.findOneAndUpdate(
            { tenantId, userId },
            { points, lastUpdated: new Date() },
            { new: true }
        );
    }

    async findAllWallets(tenantId) {
        return UserPoints.find({ tenantId });
    }

    async findWalletById(tenantId, walletId) {
        return UserPoints.findOne({ tenantId, _id: walletId });
    }

    async findWalletByUserId(tenantId, userId) {
        return UserPoints.findOne({ tenantId, userId });
    }

    async calculateTotalPoints(tenantId) {
        return UserPoints.aggregate([
            { $match: { tenantId: tenantId } },
            { $group: { _id: null, totalPoints: { $sum: "$points" } } }
        ]);
    }
}

module.exports = new PointsRepository();