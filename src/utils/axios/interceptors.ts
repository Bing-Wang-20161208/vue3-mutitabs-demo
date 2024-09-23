import axiosInstance from './axiosInstance';
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import qs from 'query-string';
import type { ApiResponse } from './type.d';

/**
 * 可以补充的内容
 * 1. 添加请求缓存，避免相同请求一定时间内多次发送
 * 2. 添加请求重试，将请求失败保存下来，一定条件下重试
 * 3. 添加请求错误处理，例如：token 过期，请求参数错误等
 * 4. 添加请求日志，请求开始和结束，请求时间，请求参数，请求返回结果等
 * 5. 请求取消，如切换路由时取消pending状态下的请求
 */

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // GET 请求参数格式化
        if (config.method?.toLowerCase() === 'get' && config.params) {
            config.params = qs.stringify(config.params);
        }

        // Form Data 请求
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        const data = response.data;
        if (`${response.status}`.startsWith('2')) {
            // 响应数据格式化
            return data;
        } else {
            return Promise.reject(data);
        }
    },
    (error: AxiosError) => {
        if (error.response) {
            const data = error.response.data as ApiResponse;
            return Promise.reject(data);
        } else {
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;