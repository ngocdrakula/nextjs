import { stringify } from 'qs';
import axios from "../../utils/axios";



export const getProductsRequest = async (params) => {
    return axios.get('product?' + stringify(params))
}
export const getFrontsRequest = async (params) => {
    return axios.get('front?' + stringify(params))
}
export const getSizesRequest = async (params) => {
    return axios.get('size?' + stringify(params))
}
export const getRoomsRequest = async (params) => {
    return axios.get('room?' + stringify(params))
}
export const getLayoutsRequest = async (params) => {
    return axios.get('layout?' + stringify(params))
}