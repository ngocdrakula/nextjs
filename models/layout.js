import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const layout = new Schema({
    name: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'room'
    },
});

export default layout;