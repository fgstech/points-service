const mongoose = require('mongoose');

const ObjectiveSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        points: { type: Number, required: true, min: 0 },
        description: { type: String, trim: true },
        slug: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

ObjectiveSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    next();
});

module.exports = mongoose.model('Objective', ObjectiveSchema);