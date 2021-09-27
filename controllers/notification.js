import { notificationData } from '../models';

function create(notification) {
    return (notificationData.create(notification));
}
function update(notificationId, notification) {
    return (notificationData.findByIdAndUpdate(notificationId, notification, { new: true }));
}
function get(notificationId) {
    return (notificationData.findById(notificationId));
}
function find(query) {
    return (notificationData.findOne(query));
}
function remove(notificationId) {
    return (notificationData.findByIdAndRemove(notificationId));
}
function getlist(query) {
    return (notificationData.find(query).sort({ createdAt: -1 }));
}
function removeMany(query) {
    return (notificationData.deleteMany(query));
}
function updateMany(query, update, option) {
    return (notificationData.updateMany(query, update, option));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist,
    removeMany,
    updateMany
}