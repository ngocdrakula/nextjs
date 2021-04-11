import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const area = new Schema({
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
    _x: { type: Number, default: 0 },
    _y: { type: Number, default: 0 },
    _z: { type: Number, default: 0 },
    width: Number,
    height: Number,
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    hoverArea: [Object],
    type: String,
})

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
    areas: [area],
    cameraFov: {
        type: Number,
        default: 45
    },
    vertical: {
        type: Number,
        default: 0
    },
    horizontal: {
        type: Number,
        default: 0
    },
    enabled: {
        type: Boolean,
        default: true
    }
});

export default layout;