import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const category = new Schema({
    name: {
        type: String,
        required: true,
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
}, {
    timestamps: { createdAt: 'createdAt' }
});

category.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.exhibitor.password;
    return (obj);
}
export default category;