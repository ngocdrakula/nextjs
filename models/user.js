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
    names: {
        vn: String,
        en: String
    },
    search: {
        type: String,
        required: true
    },
    searchs: {
        vn: String,
        en: String
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
    addresss: {
        vn: String,
        en: String
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
    representatives: {
        vn: String,
        en: String
    },
    position: {
        type: String,
        required: false,
    },
    positions: {
        vn: String,
        en: String
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
    introduces: {
        vn: String,
        en: String
    },
    product: {
        type: String,
        required: false,
    },
    products: {
        vn: String,
        en: String
    },
    contact: {
        type: String,
        required: false,
    },
    contacts: {
        vn: String,
        en: String
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
    verify: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});
user.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return (obj);
}


export default user;