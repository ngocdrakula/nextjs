import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const livestream = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    link: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    embed: {
        type: String,
        default: ''
    },
    enabled: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: { createdAt: 'createdAt' }
});
livestream.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.author.password;
    return (obj);
}

export default livestream;