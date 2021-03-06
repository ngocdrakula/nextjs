import { stringify } from 'qs';
import axios, { uploadAxios } from "../../utils/axios";

export const admin_LoginRequest = async (request) => {
    return axios.post('user/login', request)
}
export const admin_getUsersRequest = async (params) => {
    return axios.get('user?' + stringify(params))
}
export const admin_addUserRequest = async (request) => {
    return axios.post('user', request);
}
export const admin_updateUserRequest = async ({ _id, formData }) => {
    return uploadAxios.post('user/' + _id, formData);
}
export const admin_deleteUserRequest = async (_id) => {
    return axios.delete('user/' + _id);
}
export const admin_deleteMultiUserRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('user?_ids=' + _ids);
}

export const admin_getIndustriesRequest = async (params) => {
    return axios.get('industry?' + stringify(params))
}
export const admin_addIndustryRequest = async (request) => {
    return axios.post('industry', request);
}
export const admin_updateIndustryRequest = async ({ _id, ...request }) => {
    return axios.put('industry/' + _id, request);
}
export const admin_deleteIndustryRequest = async (_id) => {
    return axios.delete('industry/' + _id);
}
export const admin_deleteMultiIndustryRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('industry?_ids=' + _ids);
}

export const admin_getUserRequest = async (_id) => {
    return axios.get('user/' + _id);
}
export const admin_getCategoriesRequest = async (params) => {
    return axios.get('category?' + stringify(params))
}
export const admin_addCategoryRequest = async (request) => {
    return axios.post('category', request);
}
export const admin_updateCategoryRequest = async ({ _id, ...request }) => {
    return axios.put('category/' + _id, request);
}
export const admin_deleteCategoryRequest = async (_id) => {
    return axios.delete('category/' + _id);
}
export const admin_deleteMultiCategoryRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('category?_ids=' + _ids);
}

export const admin_getProductsRequest = async (params) => {
    return axios.get('product?' + stringify(params))
}
export const admin_addProductRequest = async (formData) => {
    return uploadAxios.post('product', formData);
}
export const admin_updateProductRequest = async ({ _id, formData }) => {
    return uploadAxios.post('product/' + _id, formData);
}
export const admin_deleteProductRequest = async (_id) => {
    return axios.delete('product/' + _id);
}
export const admin_deleteMultiProductRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('product?_ids=' + _ids);
}


export const admin_getConversationsRequest = async (params) => {
    return axios.get('conversation?' + stringify(params))
}
export const admin_getConversationByIdRequest = async ({ _id, ...params }) => {
    return axios.get('conversation/' + _id + "?" + stringify(params))
}
export const admin_getConversationByIdUserRequest = async ({ to, from }) => {
    return axios.get(`conversation/to?to=${to}&from=${from}`)
}
export const admin_postMessageRequest = async (request) => {
    return axios.post('message?', request)
}

export const admin_getContactsRequest = async (params) => {
    return axios.get('contact?' + stringify(params))
}
export const admin_addContactRequest = async (request) => {
    return axios.post('contact', request);
}
export const admin_updateContactRequest = async ({ _id, ...request }) => {
    return axios.put('contact/' + _id, request);
}
export const admin_deleteContactRequest = async (_id) => {
    return axios.delete('contact/' + _id);
}
export const admin_deleteMultiContactRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('contact?_ids=' + _ids);
}
export const admin_createContactCSVRequest = async (params) => {
    return axios.get('contact/createCSV?' + stringify(params))
}

export const admin_getSettingRequest = async (params) => {
    return axios.get('setting?' + stringify(params));
}
export const admin_updateSettingRequest = async (request) => {
    return axios.post('setting', request);
}


export const admin_getTradesRequest = async (params) => {
    return axios.get('trade?' + stringify(params))
}
export const admin_addTradeRequest = async (request) => {
    return axios.post('trade', request);
}
export const admin_updateTradeRequest = async ({ _id, ...request }) => {
    return axios.put('trade/' + _id, request);
}
export const admin_deleteTradeRequest = async (_id) => {
    return axios.delete('trade/' + _id);
}
export const admin_deleteMultiTradeRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('trade?_ids=' + _ids);
}
export const admin_createTradeCSVRequest = async (params) => {
    return axios.get('trade/createCSV?' + stringify(params))
}



export const admin_getLivestreamsRequest = async (params) => {
    return axios.get('livestream?' + stringify(params))
}
export const admin_addLivestreamRequest = async (request) => {
    return axios.post('livestream', request);
}
export const admin_updateLivestreamRequest = async ({ _id, ...request }) => {
    return axios.put('livestream/' + _id, request);
}
export const admin_deleteLivestreamRequest = async (_id) => {
    return axios.delete('livestream/' + _id);
}
export const admin_deleteMultiLivestreamRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('livestream?_ids=' + _ids);
}

export const admin_getVisitsRequest = async (params) => {
    return axios.get('visit?' + stringify(params))
}

export const admin_getNotiRequest = async (params) => {
    return axios.get('notification?' + stringify(params))
}

export const admin_readNotiRequest = async (body) => {
    return axios.put('notification?', body)
}
