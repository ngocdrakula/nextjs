import { userData } from '../models';

function create(user) {
    return (userData.create(user));
}
function update(userId, user) {
    return (userData.findByIdAndUpdate(userId, user, { new: true }));
}
function get(userId) {
    return (userData.findById(userId));
}
function find(query) {
    return (userData.findOne(query));
}
function remove(userId) {
    return (userData.findByIdAndRemove(userId));
}
function getlist(query) {
    return (userData.find(query));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist
}