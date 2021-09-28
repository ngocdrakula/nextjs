import { stringify } from 'qs';
import axios, { uploadAxios } from "../../utils/axios";



export const getIndustriesRequest = async (params) => {
    return axios.get('industry?enabled=true&' + stringify(params))
}
export const getUserRequest = async (params) => {
    return axios.get('user?enabled=true&' + stringify(params))
}
export const postLoginRequest = async (request) => {
    return axios.post('user/login', request)
}
export const postLoginGoogleRequest = async (request) => {
    return axios.post('user/google', request)
}
export const postLoginFacebookRequest = async (request) => {
    return axios.post('user/facebook', request)
}
export const postRegisterRequest = async (request) => {
    return axios.post('user/register', request)
}
export const getUserByIdRequest = async (_id) => {
    return axios.get('user/' + _id)
}
export const updateUserRequest = async ({ _id, formData }) => {
    return uploadAxios.post('user/' + _id, formData);
}
export const getProductsRequest = async (params) => {
    return axios.get('product?enabled=true&' + stringify(params))
}
export const getConversationsRequest = async (params) => {
    return axios.get('conversation?enabled=true&' + stringify(params))
}
export const getConversationByIdRequest = async ({ id, ...params }) => {
    return axios.get('conversation/' + id + "?" + stringify(params))
}
export const getConversationByIdUserRequest = async (to) => {
    return axios.get('conversation/to?to=' + to)
}
export const postMessageRequest = async (request) => {
    return axios.post('message?', request)
}
export const getCategoriesRequest = async (params) => {
    return axios.get('category?enabled=true&' + stringify(params))
}
export const postContactRequest = async (request) => {
    return axios.post('contact?', request)
}
export const getSettingRequest = async () => {
    return axios.get('setting');
}
export const getTradesRequest = async (params) => {
    return axios.get('trade?' + stringify(params))
}
export const addTradeRequest = async (request) => {
    return axios.post('trade', request);
}
export const updateTradeRequest = async ({ _id, ...request }) => {
    return axios.put('trade/' + _id, request);
}
export const deleteTradeRequest = async (_id) => {
    return axios.delete('trade/' + _id);
}
export const deleteMultiTradeRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('trade?_ids=' + _ids);
}

export const getLivestreamsRequest = async (params) => {
    return axios.get('livestream?' + stringify(params))
}

export const postResetPasswordRequest = async (request) => {
    return axios.post('user/reset', request)
}

export const verifyAccountRequest = async (request) => {
    return axios.post('user/verify', request)
}
export const getVisitRequest = async () => {
    return axios.post('visit', {})
}