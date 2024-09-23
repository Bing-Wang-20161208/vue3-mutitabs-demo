import axiosInstance from './axiosInstance';
import type { AxiosRequestConfig } from 'axios';
import type { ApiResponse } from './type';

export const request = async <T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response = await axiosInstance(config);
  return response.data;
};

export const get = <T>(url: string, config?: AxiosRequestConfig) =>
  request<T>({ method: 'GET', url, ...config });

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request<T>({ method: 'POST', url, data, ...config });

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request<T>({ method: 'PUT', url, data, ...config });

export const deleteRequest = <T>(url: string, config?: AxiosRequestConfig) =>
  request<T>({ method: 'DELETE', url, ...config });

export default axiosInstance;