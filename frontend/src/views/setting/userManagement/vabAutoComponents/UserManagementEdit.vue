<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :title="title" width="500px" @close="close">
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model.trim="form.userId" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" clearable :placeholder="form.id ? '留空则不修改密码' : ''" show-password type="password" />
      </el-form-item>
      <el-form-item label="显示名称" prop="displayName">
        <el-input v-model.trim="form.displayName" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" allow-create clearable filterable placeholder="请选择或输入角色">
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="form.phone" clearable />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model.trim="form.avatar" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="active">
        <el-switch v-model="form.active" active-text="启用" inactive-text="停用" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { doEdit } from '/@/api/userManagement'
import { userConfig } from '/@/config/data.config'

defineOptions({
  name: 'UserManagementEdit',
})

const emit = defineEmits(['fetch-data'])

const formRef = ref<FormInstance>()
const form = reactive<any>({
  id: undefined,
  userId: '',
  password: '',
  displayName: '',
  role: '',
  email: '',
  phone: '',
  avatar: '',
  active: true,
})
const rules = reactive<any>({
  userId: [{ required: true, trigger: 'blur', message: '请输入用户ID' }],
  password: [
    {
      trigger: 'blur',
      validator: (_rule: any, value: string, callback: any) => {
        if (!form.id && !value) callback(new Error('请输入密码'))
        else callback()
      },
    },
  ],
  email: [{ required: true, trigger: 'blur', message: '请输入邮箱' }],
})
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)
const roleOptions = userConfig.roleOptions

const showEdit = (row: any) => {
  dialogFormVisible.value = true
  nextTick(() => {
    if (row) {
      title.value = '编辑'
      Object.assign(form, row, { password: '' })
    } else {
      title.value = '添加'
    }
  })
}

defineExpose({
  showEdit,
})

const close = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  form.id = undefined
  form.active = true
  emit('fetch-data')
}

const save = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      await doEdit(form)
      await $baseMessage('保存成功', 'success', 'hey')
      await close()
      dialogFormVisible.value = false
    }
  })
}
</script>
