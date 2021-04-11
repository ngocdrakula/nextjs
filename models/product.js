import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const product = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    size: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'size'
    },
    front: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'front'
    },
    image: {
        type: String,
        required: true
    },
    outSide: {
        type: Boolean,
        default: false
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});


export default product;