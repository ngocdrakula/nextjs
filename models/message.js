import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const message = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    content: String,
}, {
    timestamps: true
});

message.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.author.password;
    return (obj);
}

export default message;