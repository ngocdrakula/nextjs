import { categoryData } from '../models';

function create(category) {
    return (categoryData.create(category));
}
function update(categoryId, category) {
    return (categoryData.findByIdAndUpdate(categoryId, category, { new: true }));
}
function get(categoryId) {
    return (categoryData.findById(categoryId));
}
function find(query) {
    return (categoryData.findOne(query));
}
function remove(categoryId) {
    return (categoryData.findByIdAndRemove(categoryId));
}
function getlist(query) {
    return (categoryData.find(query))
}
function removeMany(query) {
    return (categoryData.deleteMany(query));
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