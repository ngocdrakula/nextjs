import { conversationData } from '../models';

function create(conversation) {
    return (conversationData.create(conversation));
}
function update(conversationId, conversation) {
    return (conversationData.findByIdAndUpdate(conversationId, conversation, { new: true }));
}
function get(conversationId) {
    return (conversationData.findById(conversationId));
}
function find(query) {
    return (conversationData.findOne(query));
}
function remove(conversationId) {
    return (conversationData.findByIdAndRemove(conversationId));
}
function getlist(query) {
    return (conversationData.find(query));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist
}