<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import type { ElSelect, ISelectProps } from 'element-plus'
import { debounce } from 'lodash'
import { useTemplateRef } from 'vue'

/** ProSelect Props */
export interface Props extends Partial<ISelectProps> {
  /** 初始化数据 */
  initData?: any[]
  /** 传入的下拉数据，传入remoteMethod，代表不会使用options属性 */
  options?: Option[]
  /** 是否在下拉时触发远程请求，如果没有设置为true，则只在输入时开始搜索 */
  fetchOnOpen?: boolean
  /** 远程请求方法 */
  request?: (
    searchText?: string,
    page?: number,
    size?: number
  ) => Promise<Option[] | PageData<Option> | undefined>
  /** 滚动加载的距离 px，默认30 */
  scrollOffset?: number
  /** 远程加载 */
  scrollRemote?: boolean
}
// 非分页接口的数据格式
export interface Option {
  label: string | number
  value: string | number | Record<string, any>
  [key: string]: any
}
/** 如果需要分页，就必须返回这样的格式 */
export interface PageData<T> {
  data: T[]
  total: number
  page: number
  size: number
}

const props = defineProps<Props>()
const value = defineModel<Props['modelValue']>('value') // select 的modelValue
const selectRef = useTemplateRef<InstanceType<typeof ElSelect> | null>('select')
const selectOptions = ref<Option[]>()
const pageData = ref<PageData<Option>>({ data: [], total: 0, page: 1, size: 10 }) // 分页请求的时候会需要这些数据
const loading = ref(false) // 用于非滚动加载时的loading
const scrollLoading = ref(false) // 用于滚动加载时的loading
const searchText = ref<string>() // 远程搜索的搜索词
const showTotalText = computed(
  () => pageData.value.total > 0 && (selectOptions.value?.length || 0) === pageData.value.total
) // 显示已加载完所有数据的文案

watchEffect(() => {
  value.value = props.modelValue
})
watchEffect(() => {
  if (props.options?.length) {
    // 如果有options，则直接使用options，就不存在远程请求
    selectOptions.value = props.options
  } else {
    // 有初始值的情况，使用初始值
    selectOptions.value = props.initData
  }
})

// 搜索词变化时，触发远程搜索
const debounceRemoteMethod = debounce(handleRemoteMethod, 100)
watch(searchText, (val) => {
  if (val && props.request) {
    selectOptions.value = []
    loading.value = true
    debounceRemoteMethod(val, 1, pageData.value.size)
  }
})

// 远程请求
async function handleRemoteMethod(searchText?: string, page: number = 1, size: number = 200) {
  try {
    loading.value = true
    const res = await props.request?.(searchText, page, size)
    if (res) {
      if (props.scrollRemote) {
        const _res = res as PageData<Option>
        pageData.value = _res
        selectOptions.value = [...(selectOptions.value || []), ..._res.data]
      } else {
        selectOptions.value = res as Option[]
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    scrollLoading.value = false
  }
}

const handleScroll = debounce((event: Event) => {
  const target = event.target as HTMLDivElement
  const isBottom =
    target.scrollHeight - target.scrollTop - (props.scrollOffset || 30) <= target.clientHeight
  if (
    isBottom &&
    !scrollLoading.value &&
    (selectOptions.value?.length || 0) < pageData.value.total
  ) {
    scrollLoading.value = true
    handleRemoteMethod(searchText.value, pageData.value.page + 1, pageData.value.size)
  }
}, 100)
const handleVisibleChange = (v: boolean) => {
  if (v) {
    if (props.fetchOnOpen && props.request && !selectOptions.value?.length) {
      // 下拉框打开时，可能需要请求接口
      // 如果没有数据，才需要请求接口
      handleRemoteMethod(searchText.value, 1, pageData.value.size)
    }
    nextTick(() => {
      if (props.request && props.scrollRemote) {
        const dropdown = (
          selectRef.value?.$refs?.selectRef as unknown as HTMLElement
        )?.querySelector('.el-select-dropdown .el-scrollbar .el-select-dropdown__wrap')
        dropdown && dropdown.addEventListener('scroll', handleScroll)
      }
    })
  } else {
    const dropdown = (selectRef.value?.$refs?.selectRef as unknown as HTMLElement)?.querySelector(
      '.el-select-dropdown .el-scrollbar .el-select-dropdown__wrap'
    )
    dropdown && dropdown.removeEventListener('scroll', handleScroll)
  }
}
</script>
<template>
  <el-select
    ref="select"
    v-bind="props"
    v-model="value"
    @visible-change="handleVisibleChange"
    :loading="loading && !scrollLoading"
    :filterable="!!props.request || props.filterable"
    :filter-method="props.request ? (val?: string) => (searchText = val) : undefined"
    :reserve-keyword="!!props.request || props.reserveKeyword"
    :teleported="false"
  >
    <slot :options="selectOptions">
      <el-option
        v-for="item in selectOptions"
        :key="typeof item.value === 'object' ? JSON.stringify(item.value) : item.value"
        :label="item.label"
        :value="item.value"
      />
    </slot>
    <div class="pageFooter">
      <el-icon v-if="scrollLoading" class="loadingMore">
        <Loading />
      </el-icon>
      <span v-if="showTotalText">已加载全部数据</span>
    </div>
  </el-select>
</template>
<style scoped lang="scss">
.pageFooter {
  text-align: center;
  .loadingMore {
    animation: alternate 1s ease-in-out 0s infinite loadingMore;
    @keyframes loadingMore {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
