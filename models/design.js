import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const design = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    layout: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'layout'
    },
    areas: [Object],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});

export default design;