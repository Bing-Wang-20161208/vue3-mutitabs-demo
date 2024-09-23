import { ref, onMounted, onUnmounted, watch } from 'vue';
import axios, { type CancelTokenSource, AxiosError } from 'axios';
import type { ApiResponse } from '@/utils/axios/type';

/**
 * 创建一个请求管理hook
 * @param request 请求函数
 * @param options 配置项
 */
interface UseRequestOptions<T, P> {
    manual?: boolean;
    defaultParams?: P;
    params?: P;
    retry?: number;
    onSuccess?: (data: T, params: P) => void;
    onError?: (error: AxiosError) => void;
}

function useRequest<T, P>(request: (params: P) => Promise<ApiResponse<T>>, options: UseRequestOptions<T, P> = {}) {
    const loading = ref(false);
    const error = ref<AxiosError | null>(null);
    const data = ref<T | null>(null);
    const cancelTokenSource = ref<CancelTokenSource | null>(null);

    const run = async () => {
        try {
            loading.value = true;
            error.value = null;
            data.value = null;

            // 如果有取消令牌，则取消之前的请求
            if (cancelTokenSource.value) {
                cancelTokenSource.value.cancel('Operation canceled by the user.');
            }

            // 创建新的取消令牌
            cancelTokenSource.value = axios.CancelToken.source();
            const params = { ...options.defaultParams, ...options.params } as P;
            const response = await request(params);
            data.value = response as any;

            if (options.onSuccess) {
                options.onSuccess(data.value as any, params);
            }
        } catch (err) {
            error.value = err as AxiosError;
            if (options.onError) {
                options.onError(error.value);
            }
        } finally {
            loading.value = false;
        }
    };

    const cancel = () => {
        if (cancelTokenSource.value) {
            cancelTokenSource.value.cancel('Operation canceled by the user.');
            cancelTokenSource.value = null;
        }
    };

    const retryRequest = (retryCount: number) => {
        if (retryCount > 0) {
            setTimeout(() => {
                run().catch(() => retryRequest(retryCount - 1));
            }, 1000); // 重试间隔时间，可以根据需要调整
        }
    };

    if (!options.manual) {
        onMounted(run);
    }

    // 监听依赖变化
    watch(() => options.params, () => {
        run();
    });

    // 组件卸载时取消请求
    onUnmounted(cancel);

    return {
        loading: loading.value,
        error: error.value,
        data: data.value,
        run,
        cancel,
        retryRequest,
    };
}

export default useRequest;