import { productData } from '../models';

function create(product) {
    return (productData.create(product));
}
function update(productId, product) {
    return (productData.findByIdAndUpdate(productId, product, { new: true }));
}
function get(productId) {
    return (productData.findById(productId));
}
function find(query) {
    return (productData.findOne(query));
}
function remove(productId) {
    return (productData.findByIdAndRemove(productId));
}
function getlist(query) {
    return (productData.find(query));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist
}