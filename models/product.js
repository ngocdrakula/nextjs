import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const product = new Schema({
    name: {
        type: String,
        required: true
    },
    names: {
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    descriptions: {
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    },
    exhibitor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
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

product.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.exhibitor.password;
    return (obj);
}


export default product;