import { stringify } from 'qs';
import axios from "../../utils/axios";



export const getIndustriesRequest = async (params) => {
    return axios.get('industry?' + stringify(params))
}
export const getUserRequest = async (params) => {
    return axios.get('user?' + stringify(params))
}
export const postLoginRequest = async (request) => {
    return axios.post('user/login', request)
}
export const postRegisterRequest = async (request) => {
    return axios.post('user/register', request)
}
export const getUserByIdRequest = async (id) => {
    return axios.get('user/' + id)
}
export const getProductsRequest = async (params) => {
    return axios.get('product?' + stringify(params))
}
export const getConversationsRequest = async (params) => {
    return axios.get('conversation?' + stringify(params))
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
    return axios.get('category?' + stringify(params))
}