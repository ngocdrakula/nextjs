import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const front = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    type: {
        type: Number,
        default: 1
    }
});

export default front;