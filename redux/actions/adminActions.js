import { stringify } from 'qs';
import axios from "../../utils/axios";



export const admin_getProductsRequest = async (params) => {
    return axios.get('product?' + stringify(params))
}
export const admin_getFrontsRequest = async (params) => {
    return axios.get('front?' + stringify(params))
}
export const admin_getSizesRequest = async (params) => {
    return axios.get('size?' + stringify(params))
}
export const admin_getRoomsRequest = async (params) => {
    return axios.get('room?' + stringify(params))
}
export const admin_getLayoutsRequest = async (params) => {
    return axios.get('layout?' + stringify(params))
}