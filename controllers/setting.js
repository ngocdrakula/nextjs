import { settingData } from '../models';

function create(setting) {
    return (settingData.create(setting));
}
function update(settingId, setting) {
    return (settingData.findByIdAndUpdate(settingId, setting, { new: true }));
}
function get(settingId) {
    return (settingData.findById(settingId));
}
function find(query) {
    return (settingData.findOne(query));
}
function remove(settingId) {
    return (settingData.findByIdAndRemove(settingId));
}
function getlist(query) {
    return (settingData.find(query).sort({ createdAt: -1 }));
}
function removeMany(query) {
    return (settingData.deleteMany(query));
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