import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const size = new Schema({
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});

export default size;