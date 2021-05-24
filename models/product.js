import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const product = new Schema({
    name: {
        type: String,
        required: true
    },
    room: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'room',
        default: []
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
        type: [String],
        required: true,
        default: []
    },
    enabled: {
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        require: false,
        unique: false,
        default: null
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});


export default product;