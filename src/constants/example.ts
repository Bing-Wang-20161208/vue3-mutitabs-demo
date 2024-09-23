/** 随机的枚举定义 */
export enum EnumRandom {
    /** 枚举值1 */
    V1 = 'value1',
    /** 枚举值2 */
    V2 = 'value2',
}
/** 随机的Options定义 */
export const options = [
    { value: EnumRandom.V1, label: '枚举值1' },
    { value: EnumRandom.V2, label: '枚举值2' }
]
/** 随机的label定义 */
export const label = {
    [EnumRandom.V1]: '枚举值1',
    [EnumRandom.V2]: '枚举值2'
}