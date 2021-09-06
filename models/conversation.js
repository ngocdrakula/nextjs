import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const conversation = new Schema({
    leader: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        seen: {
            type: Boolean,
            default: false
        },
    },
    member: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        seen: {
            type: Boolean,
            default: false
        },
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    }]
}, {
    timestamps: { createdAt: 'createdAt' }
});
conversation.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.leader.user.password;
    delete obj.leader.user.password;
    return (obj);
}

export default conversation;