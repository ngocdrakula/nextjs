import { frontData } from '../models';

function create(front) {
    return (frontData.create(front));
}
function update(frontId, front) {
    return (frontData.findByIdAndUpdate(frontId, front, { new: true }));
}
function get(frontId) {
    return (frontData.findById(frontId));
}
function find(query) {
    return (frontData.findOne(query));
}
function remove(frontId) {
    return (frontData.findByIdAndRemove(frontId));
}
function getlist(query) {
    return (frontData.find(query));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist
}