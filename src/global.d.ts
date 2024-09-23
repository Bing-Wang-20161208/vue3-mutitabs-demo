declare module 'vue-simple-uploader' {
    type StatusText = {
        success: string,
        error: string,
        uploading: string,
        paused: string,
        waiting: string,
    }
    interface VueSimpleUploaderOptions {
        /** 单文件上传。覆盖式，如果选择了多个会把之前的取消掉 */
        singleFile?: boolean
        /** 分块时按照该值来分，最后一个上传块的大小是可能是大于等于1倍的这个值但是小于两倍的这个值大小 */
        chunkSize?: number
        /** 是否强制所有的块都是小于等于 chunkSize 的值 */
        forceChunkSize?: boolean
        /** 并发上传数 */
        simultaneousUploads?: number
        /** 上传文件时文件的参数名 */
        fileParameterName?: string
        /** 其他额外的参数，这个可以是一个对象或者是一个函数，如果是函数的话，则会传入 Uploader.File 实例、当前块 Uploader.Chunk 以及是否是测试模式 */
        query?: Record<string, any>
        /** 额外的一些请求头，如果是函数的话，则会传入 Uploader.File 实例、当前块 Uploader.Chunk 以及是否是测试模式 */
        headers?: Record<string, any>
        /** 标准的 CORS 请求是不会带上 cookie 的，如果想要带的话需要设置 withCredentials 为 true */
        withCredentials?: boolean
        /** 当上传的时候所使用的是方式，可选 multipart、octet */
        method?: string
        /** 测试的时候使用的 HTTP 方法，可以是字符串或者函数，如果是函数的话，则会传入 Uploader.File 实例、当前块 Uploader.Chunk */
        testMethod?: string
        /** 真正上传的时候使用的 HTTP 方法，可以是字符串或者函数，如果是函数的话，则会传入 Uploader.File 实例、当前块 Uploader.Chunk */
        uploadMethod?: string
        /** 如果说一个文件已经上传过了是否还允许再次上传。默认的话如果已经上传了，除非你移除了否则是不会再次重新上传的 */
        allowDuplicateUploads?: boolean
        /** 对于文件而言是否高优先级发送第一个和最后一个块。一般用来发送到服务端，然后判断是否是合法文件；例如图片或者视频的 meta 数据一般放在文件第一部分，这样可以根据第一个块就能知道是否支持 */
        prioritizeFirstAndLastChunk?: boolean
        /** 是否测试每个块是否在服务端已经上传了，主要用来实现秒传、跨浏览器上传等 */
        testChunks?: boolean
        /**
         * 服务器分片校验函数 秒传及断点续传的基础(true:不用传 false:需要传)
         * 这里根据实际业务来 用来判断哪些片已经上传过了 不用再重复上传了 [这里可以用来写断点续传！！！] 
         */
        checkChunkUploadedByResponse?: (chunk: any, message: any) => boolean
        /** 可选的函数，每个块在测试以及上传前会被调用，参数就是当前上传块实例 Uploader.Chunk，注意在这个函数中你需要调用当前上传块实例的 preprocessFinished 方法 */
        preprocess?: any
        /** 可覆盖默认的生成文件唯一标示的函数 */
        generateUniqueIdentifier?: any
        /** 最大自动失败重试上传次数，值可以是任意正整数，如果是 undefined 则代表无限次 */
        maxChunkRetries?: number
        /** 重试间隔，值可以是任意正整数，如果是 null 则代表立即重试 */
        chunkRetryInterval?: number | null
        /** 进度回调间隔 */
        progressCallbacksInterval?: number
        /** 主要用于计算平均速度，值就是从 0 到 1，如果是 1 那么上传的平均速度就等于当前上传速度，如果说长时间上传的话，建议设置为 0.02，这样剩余时间预估会更精确，这个参数是需要和 progressCallbacksInterval 一起调整的 */
        speedSmoothingFactor?: number
        /** 认为响应式成功的响应码 */
        successStatuses?: number[]
        /** 认为是出错的响应码 */
        permanentErrors?: number[]
        /** 初始文件 paused 状态 */
        initialPaused?: boolean
        /** 用于格式化你想要剩余时间，一般可以用来做多语言 */
        parseTimeRemaining?: (timeRemaining: any, parsedTimeRemaining: string) => string
        /** 目标上传 URL，可以是字符串也可以是函数，如果是函数的话，则会传入 Uploader.File 实例、当前块 Uploader.Chunk 以及是否是测试模式 */
        target?: any
    }
    interface VueSimpleUploaderProps {
        /** 组件实例化时传入的配置项 */
        options?: UploaderOptions
        /** 是否自动上传 */
        autoStart?: boolean
        /** 用于转换文件上传状态文本映射对象 */
        fileStatusText?: (status: keyof StatusText, response: any) => typeof StatusText
        statusText?: typeof StatusText
        /** 这个用来刷新组件--解决不刷新页面连续上传的缓存上传数据（注：每次上传时，强制这个值进行更改---根据自己的实际情况重新赋值） */
        key?: string | number
    }
    const Uploader: {
        install: (app: any) => void;
    };
    export default Uploader;
}