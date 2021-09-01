import { contactData } from '../models';

function create(contact) {
    return (contactData.create(contact));
}
function update(contactId, contact) {
    return (contactData.findByIdAndUpdate(contactId, contact, { new: true }));
}
function get(contactId) {
    return (contactData.findById(contactId));
}
function find(query) {
    return (contactData.findOne(query));
}
function remove(contactId) {
    return (contactData.findByIdAndRemove(contactId));
}
function getlist(query) {
    return (contactData.find(query));
}
function removeMany(query) {
    return (contactData.deleteMany(query));
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