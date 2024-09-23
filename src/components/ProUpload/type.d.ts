import type { VueSimpleUploaderOptions, VueSimpleUploaderProps } from "vue-simple-uploader"

export interface ProUploadProps extends /* @vue-ignore */ VueSimpleUploaderProps {
    options?: VueSimpleUploaderOptions
    action: string
    accept?: string
    limit?: number
    size?: number
    drag?: boolean
    /** 添加到 input 元素上的额外属性 */
    attrs?: Record<string, any>
    btnText?: string
}