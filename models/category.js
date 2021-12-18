import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const category = new Schema({
    name: {
        type: String,
        required: true,
    },
    names: {
        type: Schema.Types.Mixed,
        default: {
            vn: "",
            en: ""
        }
    },
    exhibitor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
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

category.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.exhibitor.password;
    return (obj);
}
export default category;