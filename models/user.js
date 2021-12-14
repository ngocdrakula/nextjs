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
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    },
    search: {
        type: String,
        required: true
    },
    searchs: {
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
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
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
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
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    },
    position: {
        type: String,
        required: false,
    },
    positions: {
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
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
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    },
    product: {
        type: String,
        required: false,
    },
    products: {
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    },
    contact: {
        type: String,
        required: false,
    },
    contacts: {
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
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