import { layoutData } from '../models';

function create(layout) {
    return (layoutData.create(layout));
}
function update(layoutId, layout) {
    return (layoutData.findByIdAndUpdate(layoutId, layout, { new: true }));
}
function get(layoutId) {
    return (layoutData.findById(layoutId));
}
function find(query) {
    return (layoutData.findOne(query));
}
function remove(layoutId) {
    return (layoutData.findByIdAndRemove(layoutId));
}
function getlist(query) {
    return (layoutData.find(query));
}
export default {
    create,
    get,
    update,
    remove,
    find,
    getlist
}