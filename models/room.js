import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const room = new Schema({
    name: {
        type: String,
        required: true,
        unquie: true
    },
});


export default room;