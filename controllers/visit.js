import { visitData } from '../models';

function create(visit) {
    return (visitData.create(visit));
}
function update(visitId, visit) {
    return (visitData.findByIdAndUpdate(visitId, visit, { new: true }));
}
function get(visitId) {
    return (visitData.findById(visitId));
}
function find(query) {
    return (visitData.findOne(query));
}
function remove(visitId) {
    return (visitData.findByIdAndRemove(visitId));
}
function getlist(query) {
    return (visitData.find(query).sort({ createdAt: -1 }));
}
function removeMany(query) {
    return (visitData.deleteMany(query));
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