import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const notification = new Schema({
    title: {
        type: String,
    },
    message: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});

export default notification;