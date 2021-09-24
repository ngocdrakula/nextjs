import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const trade = new Schema({
    leader: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        }
    },
    member: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        }
    },
    deadline: {
        type: Date,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false
    },
    content: {
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