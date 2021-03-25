import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const front = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
});

export default front;