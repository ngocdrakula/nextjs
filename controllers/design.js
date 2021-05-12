import { designData } from '../models';

function create(design) {
    return (designData.create(design));
}
function update(designId, design) {
    return (designData.findByIdAndUpdate(designId, design, { new: true }));
}
function get(designId) {
    return (designData.findById(designId));
}
function find(query) {
    return (designData.findOne(query));
}
function remove(designId) {
    return (designData.findByIdAndRemove(designId));
}
function getlist(query) {
    return (designData.find(query).sort({ createdAt: -1 }));
}
function removeMany(query) {
    return (designData.deleteMany(query));
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