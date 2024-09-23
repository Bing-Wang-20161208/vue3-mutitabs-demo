<script setup lang="ts">
import ProSelect, { type Option, type PageData } from '@/components/ProSelect.vue'
import ProUpload from '@/components/ProUpload/index.vue'

/**
 * 随机生成数组的方法，数组元素为对象，对象包含value和label属性
 * 该方法支持分页
 */
function randomOptions(k: string, size: number, page: number = 1): Promise<PageData<Option>> {
  console.log('k', k, size, page)
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = []
      for (let i = 0; i < size; i++) {
        data.push({
          label: `${page}-${i}`,
          value: i
        })
      }
      resolve({ data, page, size, total: 100 })
    }, 1000)
  })
}

const value = ref()

import type { PlusColumn, PageInfo } from 'plus-pro-components'

const getList = async (
  query: PageInfo & {
    status?: string
    name?: string
  }
) => {
  const { page = 1, pageSize = 20, status, name } = query || {}
  const total = 30
  const List = Array.from({ length: total }).map((item, index) => {
    return {
      id: index,
      name: index === 0 ? 'name'.repeat(20) : index + 'name',
      status: String(index % 3),
      tag: index === 1 ? 'success' : index === 2 ? 'warning' : index === 3 ? 'info' : 'danger',
      progress: 10,
      rate: index > 3 ? 2 : 3.5,
      switch: index % 2 === 0 ? true : false,
      img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      time: new Date(),
      code: `
          const getData = async params => {
            const data = await getData(params)
            return { list: data.data, ...data }
          }`,
      custom: 'custom' + index
    }
  })

  const mockList = List.filter((item) => {
    if (status && status !== item.status) {
      return false
    }
    if (name && name !== item.name) {
      return false
    }

    return true
  })

  const pageList = mockList.filter(
    (item, index) => index < pageSize * page && index >= pageSize * (page - 1)
  )

  // 等待2s
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, 2000)
  })

  return { data: pageList, success: true, total: mockList.length }
}

const tableConfig: PlusColumn[] = [
  {
    label: '名称',
    tooltip: '名称最多显示6个字符',
    width: 120,
    prop: 'name',

    tableColumnProps: {
      showOverflowTooltip: true
    }
  },
  {
    label: '状态',
    width: 120,
    prop: 'status',
    valueType: 'select',
    options: [
      {
        label: '未解决',
        value: '0',
        color: 'red'
      },
      {
        label: '已解决',
        value: '1',
        color: 'blue'
      },
      {
        label: '解决中',
        value: '2',
        color: 'yellow'
      },
      {
        label: '失败',
        value: '3',
        color: 'red'
      }
    ]
  },
  {
    label: '标签',
    width: 120,
    prop: 'tag',
    valueType: 'tag',
    fieldProps: (value: string) => {
      return { type: value }
    }
  },
  {
    label: '执行进度',
    width: 200,
    prop: 'progress',
    valueType: 'progress',
    fieldProps: (value: number) => {
      const data =
        value === 0
          ? { status: 'exception' }
          : value > 5
            ? { status: 'warning' }
            : value > 3
              ? { status: 'success' }
              : { status: 'exception' }

      return data
    }
  },
  {
    label: '代码块',
    width: 250,
    prop: 'code',
    hideInSearch: true,
    valueType: 'code'
  },
  {
    label: '评分',
    width: 200,
    prop: 'rate',
    valueType: 'rate',
    hideInSearch: true,
    editable: true
  },
  {
    label: '开关',
    width: 100,
    prop: 'switch',
    hideInSearch: true,
    valueType: 'switch',
    editable: true
  },
  {
    label: '时间',
    prop: 'time',
    valueType: 'date-picker',
    hideInForm: true
  }
]
</script>
<template>
  <div>
    <pro-select
      v-model="value"
      fetch-on-open
      scroll-remote
      :request="
        async (val = '', page = 1, size = 10) => {
          const res = await randomOptions(val, size, page)
          return res
        }
      "
    />
    <pro-upload action="" drag />
    <el-divider />
    <PlusPage
      :columns="tableConfig"
      :request="getList"
      :divider-prop="{ isShow: true, style: { margin: '10px 0' } }"
    />
  </div>
</template>
<style lang="scss" scoped></style>
