import { dayjs } from "element-plus"

/** 定义时间格式枚举 */
export enum DateFormat {
    /** 年月日 时分秒 */
    YMDHMS = 'YYYY-MM-DD HH:mm:ss',
    /** 年月日 时分 */
    YMDHM = 'YYYY-MM-DD HH:mm',
    /** 年月日 */
    YMD = 'YYYY-MM-DD',
    /** 时分秒 */
    HMS = 'HH:mm:ss',
    /** 时分 */
    HM = 'HH:mm',
}
/**
 * 将时间戳转化为指定格式的字符串
 * @param date 时间戳
 * @param fmt 格式
 * @returns 格式化后的字符串
 */
export const formatDate = (date: Date | string | number, fmt: DateFormat | string = DateFormat.YMDHMS): string | undefined => {
    try {
        return dayjs(date).format(fmt)
    } catch (error) {
        console.error(error)
    }
}

// 定义时间戳单位枚举
export enum TimestampUnit {
    /** 秒 */
    S = 'second',
    /** 毫秒 */
    MS = 'millisecond',
}

/**
 * 将时间字符串转化为时间戳，根据配置决定时间戳为秒还是毫秒
 * @param timeStr 时间字符串
 * @param formatStr 时间字符串的格式，默认为 ISO8601 格式
 * @param unit 时间戳单位，默认为毫秒
 * @returns 时间戳
 */
export const convertToTimestamp = (timeStr: string, fmt: DateFormat | string = DateFormat.YMDHMS, unit: TimestampUnit = TimestampUnit.MS): number | undefined => {
    try {
        const date = dayjs(timeStr, fmt);
        if (!date.isValid()) {
            throw new Error(`Invalid date provided: ${timeStr}`);
        }
        if (unit === TimestampUnit.S) {
            return date.unix(); // 返回秒级时间戳
        }
        return date.valueOf(); // 返回毫秒级时间戳
    } catch (error) {
        console.error(error)
    }
}