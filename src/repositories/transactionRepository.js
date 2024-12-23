// repositories/transactionRepository.js
const Transaction = require('../models/Transaction');

class TransactionRepository {
    async createTransaction(tenantId, transactionData) {
        transactionData["tenantId"] = tenantId;
        return Transaction.create(transactionData);
    }

    async getUserTransactions(tenantId, userId) {
        return Transaction.find({ tenantId, userId }).sort({ timestamp: -1 });
    }

    async getTransactionById(tenantId,transactionId) {
        return Transaction.findOne({ tenantId, transactionId });
    }

    async findTransactionsByUserId(tenantId, userId) {
        return Transaction.find({ tenantId, userId }).sort({ timestamp: -1 });
    }
}

module.exports = new TransactionRepository();