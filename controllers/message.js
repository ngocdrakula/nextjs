import { messageData } from '../models';

function create(conversation) {
    return (messageData.create(conversation));
}
function update(conversationId, conversation) {
    return (messageData.findByIdAndUpdate(conversationId, conversation, { new: true }));
}
function get(conversationId) {
    return (messageData.findById(conversationId));
}
function find(query) {
    return (messageData.findOne(query));
}
function remove(conversationId) {
    return (messageData.findByIdAndRemove(conversationId));
}
function getlist(query) {
    return (messageData.find(query));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist
}