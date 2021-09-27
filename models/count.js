import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const count = new Schema({
    address: {
        type: String,
        required: true
    },
    hit: {
        type: Number,
        default: 1
    },
    view: {
        type: Number,
        default: 1
    },
}, {
    timestamps: { createdAt: 'createdAt' }
});

export default count;