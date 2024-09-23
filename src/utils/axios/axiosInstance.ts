import axios, { type AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: '',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;