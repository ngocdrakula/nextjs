import { stringify } from 'qs';
import axios, { uploadAxios } from "../../utils/axios";

export const admin_LoginRequest = async (request) => {
    return axios.post('admin/login', request)
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

export const admin_getFrontsRequest = async (params) => {
    return axios.get('front?' + stringify(params))
}

export const admin_getSizesRequest = async (params) => {
    return axios.get('size?' + stringify(params))
}
export const admin_addSizeRequest = async (request) => {
    return axios.post('size', request);
}
export const admin_updateSizeRequest = async ({ _id, ...request }) => {
    return axios.put('size/' + _id, request);
}
export const admin_deleteSizeRequest = async (_id) => {
    return axios.delete('size/' + _id);
}
export const admin_deleteMultiSizeRequest = async (params) => {
    const _ids = params && params.join(",");
    return axios.delete('size?_ids=' + _ids);
}

export const admin_getRoomsRequest = async (params) => {
    return axios.get('room?' + stringify(params))
}

export const admin_getLayoutsRequest = async (params) => {
    return axios.get('layout?' + stringify(params))
}
export const admin_addLayoutRequest = async (formData) => {
    return uploadAxios.post('layout', formData);
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