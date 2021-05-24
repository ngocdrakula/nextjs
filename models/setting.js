import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const setting = new Schema({
    title: String,
    header: String,
    body: String,
    footer: String,
    logo: Boolean,
});

export default setting;