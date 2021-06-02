import { stringify } from 'qs';
import axios, { uploadAxios } from "../../utils/axios";

export const user_LoginRequest = async (request) => {
    return axios.post('user/login', request)
}
export const user_RegisterRequest = async (request) => {
    return axios.post('user/register', request)
}

export const user_getDesignRequest = async (id) => {
    return axios.get('design/' + id);
}
export const user_getMyDesignsRequest = async (params) => {
    return axios.get('design?' + stringify(params))
}
export const user_addDesignRequest = async (formData) => {
    return uploadAxios.post('design', formData);
}
export const user_updateDesignRequest = async ({ _id, formData }) => {
    return uploadAxios.post('design/' + _id, formData);
}
export const user_updateMyDesignRequest = async (_id) => {
    return uploadAxios.put('design/' + _id);
}
export const user_deleteDesignRequest = async (_id) => {
    return axios.delete('design/' + _id);
}
export const user_deleteMultiDesignRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('design?_ids=' + _ids);
}