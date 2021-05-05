import axios from 'axios';

const getToken = () => {
    try {
        const token = localStorage.getItem('token');
        return token
    }
    catch { return null }
}


const headers = {
    'Content-Type': 'application/json',
};

const defaultAxios = axios.create({
    baseURL: process.env.API_URL,
});

defaultAxios.interceptors.request.use(
    config => {
        config.headers['Authorization'] = 'Bearer ' + getToken();
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => { Promise.reject(error); }
);

const uploadAxios = axios.create({
    baseURL: process.env.API_URL,
});
uploadAxios.interceptors.request.use(
    config => {
        config.headers['Authorization'] = 'Bearer ' + getToken();
        config.headers['Content-Type'] = 'multipart/form-data';
        return config;
    },
    error => { Promise.reject(error); }
);
export { defaultAxios, uploadAxios }

export default defaultAxios;