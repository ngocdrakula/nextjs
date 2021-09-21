import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const trade = new Schema({
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    deadline: {
        type: Date,
        required: true,
    },
    enabled: {
        type: Boolean,
        default: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        default: ''
    }
}, {
    timestamps: { createdAt: 'createdAt' }
});
trade.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.leader.password;
    delete obj.member.password;
    return (obj);
}

export default trade;