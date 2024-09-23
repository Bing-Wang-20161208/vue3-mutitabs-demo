<!-- 
  @description: 上传文件组件参考文档：https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md
  @description: 上传文件组件参考文档：https://github.com/simple-uploader/vue-uploader/blob/vue3/README_zh-CN.md
-->

<script setup lang="ts">
import { Upload, UploadFilled } from '@element-plus/icons-vue'
import type { ProUploadProps } from './type'
import { ElMessage } from 'element-plus'
import { useTemplateRef } from 'vue'

const props = withDefaults(defineProps<ProUploadProps>(), {
  options: () => ({}),
  drag: false,
  attrs: () => ({}),
  autoStart: true,
  btnText: '选择文件',
  key: new Date().getTime(),
  statusText: {
    success: '成功',
    error: '失败',
    uploading: '上传中',
    paused: '暂停',
    waiting: '等待'
  },
  // 用于转换文件上传状态文本映射对象
  fileStatusText: function (status: 'success', response: any) {
    // 第一个 status 为状态，第二个为响应内容
    const statusTextMap = {
      success: '成功',
      error: '失败',
      uploading: '上传中',
      paused: '暂停',
      waiting: '等待'
    }
    return statusTextMap[status]
  }
})
// options
const uploadOptions = computed(() => ({
  singleFile: props.limit === 1,
  chunkSize: 20 * 1024 * 1024,
  forceChunkSize: false,
  simultaneousUploads: 5,
  fileParameterName: 'file',
  query: {},
  headers: {},
  withCredentials: false,
  method: 'multipart/form-data',
  testMethod: 'GET',
  uploadMethod: 'POST',
  allowDuplicateUploads: false,
  prioritizeFirstAndLastChunk: false,
  testChunks: false,
  progressCallbacksInterval: 500,
  speedSmoothingFactor: 0.1,
  successStatuses: [200, 201, 202],
  permanentErrors: [404, 415, 500, 501],
  initialPaused: false,
  parseTimeRemaining(timeRemaining: any, parsedTimeRemaining: string) {
    return parsedTimeRemaining
      .replace(/\syears?/, '年')
      .replace(/\days?/, '天')
      .replace(/\shours?/, '小时')
      .replace(/\sminutes?/, '分钟')
      .replace(/\sseconds?/, '秒')
  },
  target: `${import.meta.env.DEV ? '/dev' : ''}/yiiapi${props.action}`,
  ...props.options
}))
// input attrs
const uploadAttrs = computed(() => ({ accept: props.accept, ...props.attrs }))
const uploaderRef = useTemplateRef<{ uploader: Record<string, any> }>('uploader')

const emit = defineEmits(['file-added', 'file-success', 'file-error', 'file-complete', 'complete'])

// 添加文件，校验
const onFileAdded = (file: any) => {
  // fileList: 所有添加的file，包含本次
  // files: 所有添加的file，不包含本次，组件外部获取的一般考虑files属性
  emit('file-added', {
    fileList: uploaderRef.value?.uploader.fileList,
    files: uploaderRef.value?.uploader.files
  })
  if (props.limit && props.limit < (uploaderRef.value?.uploader.fileList || []).length) {
    ElMessage.warning('最多只能上传' + props.limit + '个文件')
    file.ignored = true
  } else if (props.size && props.size < file.size / 1024 / 1024) {
    ElMessage.warning('单个文件大小不能超过' + props.size + 'MB')
    file.ignored = true
  } else if (
    props.accept &&
    props.accept.split(',').some((type) => !file.name.toLowerCase().endsWith(type))
  ) {
    ElMessage.warning(`请上传文件扩展名为${props.accept}的文件`)
    file.ignored = true
  }
}
// 上传成功
const onFileSuccess = (rootFile: any, file: any, message: any, chunk: any) => {
  try {
    // TODO 交互逻辑，需要和后端对接
    emit('file-success', rootFile, file, JSON.parse(message), chunk)
  } catch (error) {
    console.log(error)
  }
}
// 上传完成
const onFileComplete = (rootFile: any) => {
  emit('file-complete', rootFile)
}
// 上传完成，不管上传多少文件，一次上传只会执行一次
const complete = () => {
  emit('complete')
}
// 上传失败
const onFileError = (rootFile: any, file: any, message: any, chunk: any) => {
  ElMessage.error(`文件: ${file.name} 上传出错`, message)
  emit('file-error', rootFile, file, message, chunk)
}

/** 开始、继续上传 */
const resume = () => {
  // 官方文档是upload，但是实测这个方法才可行
  uploaderRef.value?.uploader.resume()
}
/** 暂停上传 */
const pause = () => {
  uploaderRef.value?.uploader.pause()
}
/** 取消所有上传文件，文件会被移除掉 */
const cancel = () => {
  uploaderRef.value?.uploader.cancel()
}
// 暴露ref 方法
defineExpose({
  /** 开始、继续上传 */
  resume,
  /** 暂停上传 */
  pause,
  /** 取消所有上传文件，文件会被移除掉 */
  cancel,
  /** 上传组件实例 */
  uploaderRef
})
</script>
<template>
  <uploader
    v-bind="props"
    :options="uploadOptions"
    ref="uploader"
    @file-added="onFileAdded"
    @file-success="onFileSuccess"
    @file-complete="onFileComplete"
    @complete="complete"
    @file-error="onFileError"
    class="uploader"
  >
    <template #default="{ files, fileList, started }">
      <uploader-unsupport>请换用高版本浏览器</uploader-unsupport>
      <slot :files="files" :file-list="fileList" :started="started">
        <uploader-drop v-if="drag">
          <uploader-btn :attrs="uploadAttrs" :single="limit === 1">
            <div class="upload-drag-btn">
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <span class="btnText">{{ btnText }}</span>
            </div>
          </uploader-btn>
        </uploader-drop>
        <uploader-btn v-else :attrs="uploadAttrs" :single="limit === 1">
          <el-button type="primary" :icon="Upload">
            {{ btnText }}
          </el-button>
        </uploader-btn>
      </slot>
      <div class="extra" v-if="$slots.extra"><slot name="extra"></slot></div>
      <slot name="upload-list" :files="files" :file-list="fileList" :started="started">
        <uploader-list></uploader-list>
      </slot>
    </template>
  </uploader>
</template>
<style scoped lang="scss">
.uploader {
  .uploader-drop {
    padding: 0;
    background-color: var(--el-bg-color);
    .uploader-btn {
      display: block;
      height: 100%;
      padding: 10px 0 30px;
      .upload-drag-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100%;
        .el-icon--upload {
          font-size: 100px;
          margin-bottom: 10px;
        }
      }
      &:hover {
        background-color: var(--el-bg-color);
        color: var(--el-color-primary);
        transition: all 0.3s;
      }
    }
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
  .uploader-btn {
    border: none;
    padding: 0;
    margin: 0;
  }
  .extra {
    margin-top: 5px;
    font-size: var(--el-font-size-base);
    color: var(--el-color-info);
  }
}
</style>
