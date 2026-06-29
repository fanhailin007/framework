<template>
  <div class="switch-container no-background-container">
    <vab-card title="基础用法">
      <el-switch v-model="value" active-color="var(--el-color-success)" inactive-color="var(--el-color-warning)" />
    </vab-card>
    <vab-card title="文字描述">
      <el-switch v-model="value1" active-text="按月付费" inactive-text="按年付费" />
    </vab-card>
    <vab-card title="禁用状态">
      <el-switch v-model="value2" disabled style="margin-right: 10px" />
      <el-switch v-model="value3" disabled />
    </vab-card>
    <vab-card title="自定义值">
      <el-switch v-model="customValue" active-value="100" inactive-value="0" />
      <div style="margin-top: 10px">当前值: {{ customValue }}</div>
    </vab-card>
    <vab-card title="加载状态">
      <el-switch v-model="loadingValue" loading />
    </vab-card>
    <vab-card title="不同尺寸">
      <el-switch v-model="sizeValue" size="large" style="margin-right: 10px" />
      <el-switch v-model="sizeValue" style="margin-right: 10px" />
      <el-switch v-model="sizeValue" size="small" />
    </vab-card>
    <vab-card title="带图标">
      <el-switch v-model="iconValue" :active-icon="Check" :inactive-icon="Close" inline-prompt />
    </vab-card>
    <vab-card title="事件处理">
      <el-switch v-model="eventValue" @change="handleChange" />
      <div style="margin-top: 10px">开关状态: {{ eventValue ? '开启' : '关闭' }}</div>
    </vab-card>
    <vab-card title="带验证">
      <el-form ref="formRef" :model="formData" :rules="rules">
        <el-form-item prop="agree">
          <el-switch v-model="formData.agree" active-text="同意协议" />
        </el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
import { Check, Close } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

defineOptions({
  name: 'Switch',
})

const value = ref<boolean>(true)
const value1 = ref<boolean>(true)
const value2 = ref<boolean>(true)
const value3 = ref<boolean>(false)
const customValue = ref<string | number>('100')
const loadingValue = ref<boolean>(true)
const sizeValue = ref<boolean>(true)
const iconValue = ref<boolean>(true)
const eventValue = ref<boolean>(false)

const formRef = ref<FormInstance>()
const formData = reactive({
  agree: false,
})
const rules = reactive({
  agree: [
    {
      type: 'boolean' as const,
      enum: [true],
      message: '请同意协议',
      trigger: 'change',
    },
  ],
})

const handleChange = (val: string | number | boolean) => {
  console.log('开关状态改变:', val)
}

const submitForm = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    $baseMessage('验证通过', 'success', 'hey')
  } catch (error) {
    console.error('验证失败', error)
  }
}
</script>
