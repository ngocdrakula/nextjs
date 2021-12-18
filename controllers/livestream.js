import { livestreamData } from '../models';

function create(trade) {
    return (livestreamData.create(trade));
}
function update(tradeId, trade) {
    return (livestreamData.findByIdAndUpdate(tradeId, trade, { new: true }));
}
function get(tradeId) {
    return (livestreamData.findById(tradeId));
}
function find(query) {
    return (livestreamData.findOne(query));
}
function remove(tradeId) {
    return (livestreamData.findByIdAndRemove(tradeId));
}
function getlist(query) {
    return (livestreamData.find(query));
}
function removeMany(query) {
    return (livestreamData.deleteMany(query));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist,
    removeMany
}