import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const category = new Schema({
    name: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    enabled: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: { createdAt: 'createdAt' }
});

export default category;