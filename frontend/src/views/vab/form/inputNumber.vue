<template>
  <div class="input-number-container no-background-container">
    <vab-card title="基础用法">
      <el-input-number v-model="num" label="描述文字" :max="10" :min="1" />
    </vab-card>
    <vab-card title="禁用状态">
      <el-input-number v-model="num2" :disabled="true" />
    </vab-card>
    <vab-card title="步长">
      <el-input-number v-model="num3" :step="2" />
    </vab-card>
    <vab-card title="精度">
      <el-input-number v-model="num4" :max="10" :precision="2" :step="0.1" />
    </vab-card>
    <vab-card title="按钮位置">
      <el-input-number v-model="num5" controls-position="right" :max="10" :min="1" />
    </vab-card>
    <vab-card title="事件监听">
      <el-input-number v-model="eventNum" :max="10" :min="1" @blur="handleBlur" @change="handleChange" @focus="handleFocus" />
      <div style="margin-top: 8px; font-size: 13px; color: #888">
        当前值：{{ eventNum }}
        <br />
        事件日志：{{ eventLog }}
      </div>
    </vab-card>
    <vab-card title="格式化显示（千分位）">
      <el-input-number v-model="formatNum" :formatter="formatThousand" :max="1000000" :min="1000" :parser="parseThousand" />
      <div style="margin-top: 8px; font-size: 13px; color: #888">实际值：{{ formatNum }}</div>
    </vab-card>
    <vab-card title="限制输入（仅正整数）">
      <el-input-number v-model="intNum" :formatter="formatIntOnly" :max="100" :min="1" :parser="parseIntOnly" :step="1" />
    </vab-card>
    <vab-card title="自定义按钮">
      <el-button :disabled="customBtnNum <= 0" style="margin-right: 10px" @click="customBtnNum--">减一</el-button>
      <el-input-number v-model="customBtnNum" :controls="false" :max="10" :min="0" />
      <el-button :disabled="customBtnNum >= 10" style="margin-left: 10px" @click="customBtnNum++">加一</el-button>
    </vab-card>
    <vab-card title="异步控制（模拟异步校验）">
      <el-input-number v-model="asyncNum" :max="10" :min="1" @change="handleAsyncChange" />
      <div style="margin-top: 8px; font-size: 13px; color: #888">校验状态：{{ asyncStatus }}</div>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'InputNumber',
})
const num = ref<any>(1)
const num2 = ref<any>(1)
const num3 = ref<any>(5)
const num4 = ref<any>(1)
const num5 = ref<any>(1)

const eventNum = ref<any>(1)
const eventLog = ref<string>('')
const handleChange = (cur: number | undefined) => {
  eventLog.value = `change事件触发，当前值：${cur}`
}
const handleFocus = () => {
  eventLog.value = 'focus事件触发'
}
const handleBlur = () => {
  eventLog.value = 'blur事件触发'
}

const formatNum = ref<any>(1000)
const formatThousand = (value: number | string) => {
  if (typeof value === 'number') value = value.toString()
  return value.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')
}
const parseThousand = (value: string) => {
  return value.replaceAll(',', '')
}

const intNum = ref<any>(1)
const parseIntOnly = (value: string) => {
  // 只允许正整数
  return value.replaceAll(/\D/g, '').replace(/^0+/, '')
}
const formatIntOnly = (value: number | string) => {
  return value
}

const customBtnNum = ref<any>(0)

const asyncNum = ref<any>(1)
const asyncStatus = ref<string>('等待输入...')
const handleAsyncChange = (cur: number | undefined) => {
  asyncStatus.value = '校验中...'
  setTimeout(() => {
    if ((cur ?? 0) % 2 === 0) {
      asyncStatus.value = '校验通过（偶数）'
    } else {
      asyncStatus.value = '校验未通过（奇数）'
    }
  }, 800)
}
</script>
