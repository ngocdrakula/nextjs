import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const contact = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});


export default contact;