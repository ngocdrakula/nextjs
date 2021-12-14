import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const design = new Schema({
    name: {
        type: String,
        required: true,
    },
    enabled: {
        type: Boolean,
        default: true
    },
    names: {
        vn: String,
        en: String
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});

export default design;