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
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});

export default design;