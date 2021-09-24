import { tradeData } from '../models';

function create(trade) {
    return (tradeData.create(trade));
}
function update(tradeId, trade) {
    return (tradeData.findByIdAndUpdate(tradeId, trade, { new: true }));
}
function get(tradeId) {
    return (tradeData.findById(tradeId));
}
function find(query) {
    return (tradeData.findOne(query));
}
function remove(tradeId) {
    return (tradeData.findByIdAndRemove(tradeId));
}
function getlist(query) {
    return (tradeData.find(query).sort({ createdAt: -1 }));
}
function removeMany(query) {
    return (tradeData.deleteMany(query));
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