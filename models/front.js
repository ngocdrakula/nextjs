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
    rate: {
        type: Number,
        default: 0
    }
});

export default front;