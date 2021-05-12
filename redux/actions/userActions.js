import { stringify } from 'qs';
import axios, { uploadAxios } from "../../utils/axios";

export const user_LoginRequest = async (request) => {
    return axios.post('user/login', request)
}
export const user_RegisterRequest = async (request) => {
    return axios.post('user/register', request)
}

export const user_getDesignRequest = async (_id) => {
    return axios.get('design/' + _id)
}

export const user_getDesignsRequest = async (params) => {
    return axios.get('design?' + stringify(params))
}
export const user_addDesignRequest = async (request) => {
    return uploadAxios.post('design' , request)
}

export const user_deleteMultiDesignRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('product?_ids=' + _ids);
}