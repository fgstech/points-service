const ObjectiveRepo = require("../repositories/objetiveRepository");

class ObjetiveService {
    async create(tenantId, data){
        return await ObjectiveRepo.create(tenantId, data);
    }

    async find(tenantId){
        return await ObjectiveRepo.find(tenantId);
    }

    async findById(tenantId, id){
        return await ObjectiveRepo.findById(tenantId, id);
    }

    async update(tenantId, id, data){
        return await ObjectiveRepo.update(tenantId, id, data);
    }

    async remove(tenantId, id){
        return await ObjectiveRepo.remove(tenantId, id);
    }

    async findBySlug(tenantId, slug){
        return await ObjectiveRepo.findBySlug(tenantId, slug);
    }
}

module.exports = new ObjetiveService();