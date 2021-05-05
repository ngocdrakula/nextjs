import { sizeData } from '../models';

function create(size) {
    return (sizeData.create(size));
}
function update(sizeId, size) {
    return (sizeData.findByIdAndUpdate(sizeId, size, { new: true }));
}
function get(sizeId) {
    return (sizeData.findById(sizeId));
}
function find(query) {
    return (sizeData.findOne(query));
}
function remove(sizeId) {
    return (sizeData.findByIdAndRemove(sizeId));
}
function getlist(query) {
    return (sizeData.find(query).sort({ createdAt: -1 }));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist
}