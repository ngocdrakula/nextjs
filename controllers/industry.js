import { industryData } from '../models';

function create(industry) {
    return (industryData.create(industry));
}
function update(industryId, industry) {
    return (industryData.findByIdAndUpdate(industryId, industry, { new: true }));
}
function get(industryId) {
    return (industryData.findById(industryId));
}
function find(query) {
    return (industryData.findOne(query));
}
function remove(industryId) {
    return (industryData.findByIdAndRemove(industryId));
}
function getlist(query) {
    return (industryData.find(query));
}
function removeMany(query) {
    return (industryData.deleteMany(query));
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