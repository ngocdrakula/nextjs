import axios from 'axios';

const getToken = () => {
    try {
        const token = localStorage.getItem('token');
        return token
    }
    catch {
        return null
    }
}


const headers = {
    'Content-Type': 'application/json',
};
const token = getToken();
if (token) headers.Authorization = "Bear " + token;

export const defaultAxios = axios.create({
    baseURL: process.env.API_URL,
    headers: headers
});

const uploadHeaders = {
    ...headers,
    'Content-Type': 'multipart/form-data',
}
export const uploadAxios = axios.create({
    baseURL: process.env.API_URL,
    headers: uploadHeaders
});
export default defaultAxios;
