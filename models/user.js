import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const user = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    hotline: {
        type: String,
        required: false,
    },
    fax: {
        type: String,
        required: false,
    },
    representative: {
        type: String,
        required: false,
    },
    position: {
        type: String,
        required: false,
    },
    mobile: {
        type: String,
        required: false,
    },
    re_email: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: false,
    },
    introduce: {
        type: String,
        required: false,
    },
    product: {
        type: String,
        required: false,
    },
    contact: {
        type: String,
        required: false,
    },
    mode: {
        type: Number,
        required: true,
        default: 0
    },
    enabled: {
        type: Boolean,
        default: true
    },
    industry: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'industry'
    }],
    code: {
        type: Number,
        default: 0
    },
    expired: {
        type: Date,
        required: false,
    },
}, {
    timestamps: { createdAt: 'createdAt' }
});
user.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return (obj);
}


export default user;