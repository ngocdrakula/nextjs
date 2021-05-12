import mongoose from 'mongoose';
import front from "./front";
import layout from "./layout";
import product from "./product";
import room from "./room";
import size from "./size";
import user from "./user";
import design from "./design";

mongoose.models = {};

export const frontData = mongoose.model('front', front);
export const layoutData = mongoose.model('layout', layout);
export const productData = mongoose.model('product', product);
export const roomData = mongoose.model('room', room);
export const sizeData = mongoose.model('size', size);
export const userData = mongoose.model('user', user);
export const designData = mongoose.model('design', design);