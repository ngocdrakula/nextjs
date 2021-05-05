import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const user = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mode: {
        type: Boolean
    }
});


export default user;