import { roomData } from '../models';

function create(room) {
    return (roomData.create(room));
}
function update(roomId, room) {
    return (roomData.findByIdAndUpdate(roomId, room, { new: true }));
}
function get(roomId) {
    return (roomData.findById(roomId));
}
function find(query) {
    return (roomData.findOne(query));
}
function remove(roomId) {
    return (roomData.findByIdAndRemove(roomId));
}
function getlist(query) {
    return (roomData.find(query));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist
}