<template>
  <div>
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="付款账户">
        {{ infoData.payAccount }}
      </el-form-item>
      <el-form-item label="收款账户">
        {{ infoData.gatheringAccount }}
      </el-form-item>
      <el-form-item label="收款人姓名">
        {{ infoData.gatheringName }}
      </el-form-item>
      <el-form-item label="转账金额">
        <strong>￥{{ infoData.price }}元</strong>
      </el-form-item>
      <el-form-item label="支付密码" prop="password">
        <el-input v-model="form.password" clearable type="password" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'

defineOptions({
  name: 'Step2',
})
defineProps({
  infoData: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const formRef = ref<FormInstance>()
const form = reactive<any>({
  password: '123456',
})
const rules = reactive<any>({
  password: [{ required: true, message: '请输入支付密码', trigger: 'blur' }],
})

// 暴露表单验证方法给父组件
const validate = () => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((valid: any) => {
      if (valid) {
        resolve(form)
      } else {
        reject(new Error('表单验证失败'))
      }
    })
  })
}

// 暴露给父组件
defineExpose({
  validate,
  form,
})
</script>

<style lang="scss" scoped>
.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}
</style>
