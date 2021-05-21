import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const product = new Schema({
    name: {
        type: String,
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'room'
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
    type: {
        type: String,
        default: 'floor'
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});


export default product;