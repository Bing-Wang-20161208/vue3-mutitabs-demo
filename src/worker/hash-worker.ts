import SparkMD5 from 'spark-md5'
import type ProUpload from '@/components/ProUpload/type'

/**
 * 创建文件块
 * 
 * 此函数将一个大文件切割成多个较小的块，每个块的大小由 chunkSize 指定
 * 这在需要对大文件进行分块处理或传输时特别有用
 * 
 * @param file 要切割的文件，应为 FileType 类型
 * @param chunkSize 每个文件块的大小，以字节为单位
 * @returns 返回一个 Promise，该 Promise 解析为一个包含文件块的数组
 *          每个文件块都是一个对象，包含一个 'chunkFile' 属性，该属性是一个 Blob 对象，表示文件的一个子集
 */
const createFileChunk = (file: ProUpload.FileType, chunkSize: number): Promise<ProUpload.FileChunk[]> =>
    new Promise((resolve, reject) => {
        try {
            const fileChunkList: ProUpload.FileChunk[] = []
            let cur = 0
            while (cur < file.size) {
                // 使用 Blob 的 slice 方法创建文件块，并将其添加到文件块列表中
                fileChunkList.push({
                    chunkFile: file.slice(cur, cur + chunkSize)
                })
                cur += chunkSize
            }
            resolve(fileChunkList)
        } catch (error) {
            reject(error)
        }
    })

// 加载并计算文件切片的MD5
const calculateChunksHash = async (fileChunkList: ProUpload.FileChunk[]) => {
    const spark = new SparkMD5.ArrayBuffer()
    let percentage = 0
    let count = 0 // 计算切片次数
    // 处理文件切片
    const loadNext = async (index: number): Promise<string> => {
        if (index >= fileChunkList.length) return spark.end()
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsArrayBuffer(fileChunkList[index].chunkFile)
            reader.onload = async (e) => {
                if (e.target?.result) {
                    count++
                    spark.append(e.target.result as ArrayBuffer)
                    percentage += 100 / fileChunkList.length
                    postMessage({ percentage }) // 发送进度到主进程
                    resolve(loadNext(index + 1)) // 递归处理下一个切片
                } else reject(new Error('reader.result is null'))
            }
            reader.onerror = reject
        })
    }
    try {
        // 开始计算切片
        const fileHash = await loadNext(0) // 等待所有切片处理完毕
        postMessage({ percentage, fileHash, fileChunkList }) // 发送最终结果到主进程
    } catch (error) {
        postMessage({ name: 'error', data: error })
    } finally {
        close() // 关闭worker
    }
}

// 监听消息
onmessage = async (e: MessageEvent<{ file: ProUpload.FileType, chunkSize: number }>) => {
    try {
        const { file, chunkSize } = e.data
        const fileChunkList = await createFileChunk(file, chunkSize)
        await calculateChunksHash(fileChunkList)
    } catch (error) {
        // 这里实际上不会捕获到calculateChunksHash中的错误，因为错误已经在Worker内部处理了
        // 但如果未来有其他的异步操作，这里可以捕获到它们
        console.error('worker监听发生错误:', error)
    }
}
// 监听错误消息
onerror = (e: string | Event) => {
    console.error('worker监听发生错误:', e)
    close()
}