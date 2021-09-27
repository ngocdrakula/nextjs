import mongoose from 'mongoose';
import category from "./category";
import conversation from "./conversation";
import message from "./message";
import product from "./product";
import industry from "./industry";
import user from "./user";
import contact from "./contact";
import trade from "./trade";
import livestream from "./livestream";
import visit from "./visit";
import count from "./count";
import notification from "./notification";

mongoose.models = {};

export const categoryData = mongoose.model('category', category);
export const conversationData = mongoose.model('conversation', conversation);
export const messageData = mongoose.model('message', message);
export const productData = mongoose.model('product', product);
export const industryData = mongoose.model('industry', industry);
export const userData = mongoose.model('user', user);
export const contactData = mongoose.model('contact', contact);
export const tradeData = mongoose.model('trade', trade);
export const livestreamData = mongoose.model('livestream', livestream);
export const visitData = mongoose.model('visit', visit);
export const countData = mongoose.model('count', count);
export const notificationData = mongoose.model('notification', notification);