import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const product = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    exbihitor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'industry'
    },
    enabled: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: { createdAt: 'createdAt' }
});

product.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.exbihitor.password;
    return (obj);
}


export default product;