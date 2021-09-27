import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const visit = new Schema({
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
    flag: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});

export default visit;