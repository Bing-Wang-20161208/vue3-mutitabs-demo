/**
 * 下载文件，自行从url中截文件名，也可自行传入名称
 * @param url 文件地址
 * @param fileName 文件名
 */
export const downLoadFile = (url: string, fileName?: string): void => {
    const a = document.createElement('a');
    a.href = url;
    // 从url中截取文件名
    const _fileName = url.substring(url.lastIndexOf('/') + 1);
    a.download = fileName || _fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

/**
 * 根据文件名获取文件名称和文件后缀
 * @param fileName 文件名
 * @returns 返回一个对象，包含文件名和文件后缀
 */
export const getFileNameAndSuffix = (fileName: string): { fileName: string, suffix: string } => {
    const ldx = fileName.lastIndexOf('.')
    if (ldx < 0) return { fileName: fileName, suffix: '' };
    const suffix = fileName.substring(ldx + 1);
    return {
        fileName: fileName.substring(0, ldx),
        suffix
    };
};