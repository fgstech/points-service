const ObjetiveService = require("../services/objetiveService")

class ObjetiveController {
    async create(req, res) {
        try {
            const { tenantId, body } = req;
            const data = await ObjetiveService.create(tenantId, data);
            res.status(201).json({ data });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async find(req, res) {
        try {
            const { tenantId } = req;
            const data = await ObjetiveService.find(tenantId);
            res.status(201).json({ data });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const { tenantId, params } = req;
            const data = await ObjetiveService.findById(tenantId, params.id);
            res.status(201).json({ data });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { tenantId, params, body } = req;
            const data = await ObjetiveService.update(tenantId, params.id, body);
            res.status(201).json({ data });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async remove(req, res) {
        try {
            const { tenantId, params } = req;
            const data = await ObjetiveService.remove(tenantId, params.id);
            res.status(201).json({ data });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
}


module.exports = new ObjetiveController();