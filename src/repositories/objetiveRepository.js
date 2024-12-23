// repositories/pointsRepository.js
const ObjetiveModel = require('../models/Objective');

class ObjetiveRepository {
    async find(tenantId) {
        return await ObjetiveModel.find({ tenantId });
    }

    async findById(tenantId, id) {
        return await ObjetiveModel.findOne({ tenantId, _id: id });
    }

    async create(tenantId, data) {
        data["tenantId"] = tenantId;
        return ObjetiveModel.create(data);
    }

    async update(tenantId, id, data) {
        return await ObjetiveModel.updateOne({ tenantId, _id: id }, { $set: data }, { upsert: true });
    }

    async remove(tenantId, id) {
        return await ObjetiveModel.deleteOne({ tenantId, _id: id });
    }

    async findBySlug(tenantId, slug) {
        return await ObjetiveModel.findOne({ tenantId, slug });
    }
}

module.exports = new ObjetiveRepository();