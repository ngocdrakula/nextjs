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
    titles: {
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    },
    description: {
        type: String,
        default: ''
    },
    descriptions: {
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    },
    embed: {
        type: String,
        default: ''
    },
    enabled: {
        type: Boolean,
        default: true
    },
    index: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});
livestream.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.author.password;
    return (obj);
}

export default livestream;