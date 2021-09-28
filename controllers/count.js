import { countData } from '../models';

function create(count) {
    return (countData.create(count));
}
function update(countId, count) {
    return (countData.findByIdAndUpdate(countId, count, { new: true }));
}
function get(countId) {
    return (countData.findById(countId));
}
function find(query) {
    return (countData.findOne(query));
}
function remove(countId) {
    return (countData.findByIdAndRemove(countId));
}
function getlist(query) {
    return (countData.find(query).sort({ createdAt: -1 }));
}
function removeMany(query) {
    return (countData.deleteMany(query));
}
function aggregate(query) {
    return (countData.aggregate(query));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist,
    removeMany,
    aggregate
}