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


export const admin_getRoomsRequest = async (params) => {
    return axios.get('room?' + stringify(params))
}

export const admin_getLayoutsRequest = async (params) => {
    return axios.get('layout?' + stringify(params))
}
export const admin_cloneLayoutRequest = async (request) => {
    return axios.post('layout/clone', request);
}
export const admin_updateLayoutRequest = async ({ _id, formData }) => {
    return uploadAxios.post('layout/' + _id, formData);
}
export const admin_deleteLayoutRequest = async (_id) => {
    return axios.delete('layout/' + _id);
}
export const admin_deleteMultiLayoutRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('layout?_ids=' + _ids);
}
export const admin_getLayoutFromUrl = async (url) => {
    return axios.get('admin/getUrl?url=' + url);
}

export const admin_getSettingRequest = async () => {
    return axios.get('admin/setting');
}
export const admin_updateSettingRequest = async (request) => {
    return axios.post('admin/setting', request);
}