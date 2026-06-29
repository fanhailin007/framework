<template>
  <vab-dialog :model-value="dialogFormVisible" :title="title" top="50px" width="600px" @close="close" @opened="opened">
    <el-form ref="formRef" label-width="100px" :model="form" :rules="formRules">
      <el-form-item label="团队名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入团队名称" />
      </el-form-item>
      <el-form-item label="团队头像">
        <el-upload
          v-model:file-list="fileList"
          accept="image/*"
          :action="uploadAction"
          :before-upload="beforeUpload"
          drag
          :headers="uploadHeaders"
          :limit="1"
          :on-error="handleUploadError"
          :on-success="handleUploadSuccess"
          style="width: 100%"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            将头像拽至此处或
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">支持 jpg/png/gif 格式，文件大小不超过 2MB</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="团队描述" prop="description">
        <el-input v-model.trim="form.description" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入团队描述" type="textarea" />
      </el-form-item>
      <el-form-item label="团队成员">
        <el-select v-model="form.memberIds" filterable multiple placeholder="请选择团队成员" style="width: 100%">
          <el-option v-for="member in members" :key="member.id" :label="member.name" :value="member.id">
            <span style="float: left">{{ member.name }}</span>
            <span style="float: right; font-size: 13px; color: #8492a6">{{ member.department }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" controls-position="right" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, UploadProps, UploadUserFile } from 'element-plus'
import { doEdit, uploadAvatar } from '/@/api/teamManagement'

defineOptions({
  name: 'TeamManagementEdit',
})

const $emit = defineEmits(['fetch-data'])

const formRef = ref<FormInstance>()
const dialogFormVisible = ref<boolean>(false)
const title = ref<string>('')
const form = reactive<any>({
  name: '',
  avatar: '',
  description: '',
  memberIds: [],
  order: 0,
})

const fileList = ref<UploadUserFile[]>([])
const uploadAction = '/teamManagement/uploadAvatar'
const uploadHeaders = {
  // 如果需要认证，可以在这里添加token
}

// 模拟成员数据（应该从API获取，但假设这个数据由父组件传入）
const members = ref([
  { id: 1, name: '张三', department: '前端开发部' },
  { id: 2, name: '李四', department: '前端开发部' },
  { id: 3, name: '王五', department: '后端开发部' },
  { id: 4, name: '赵六', department: '后端开发部' },
  { id: 5, name: '钱七', department: '测试部' },
  { id: 6, name: '孙八', department: '测试部' },
  { id: 7, name: '周九', department: '设计部' },
  { id: 8, name: '吴十', department: '设计部' },
  { id: 9, name: '郑一', department: '产品部' },
  { id: 10, name: '王二', department: '产品部' },
])

const formRules = reactive<any>({
  name: [
    { required: true, message: '请输入团队名称', trigger: 'blur' },
    { min: 2, max: 20, message: '团队名称长度为 2 到 20 个字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入团队描述', trigger: 'blur' },
    { min: 5, max: 100, message: '团队描述长度为 5 到 100 个字符', trigger: 'blur' },
  ],
  order: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})

// 文件上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    $baseMessage('只能上传图片文件!', 'error', 'hey')
    return false
  }
  if (!isLt2M) {
    $baseMessage('图片大小不能超过 2MB!', 'error', 'hey')
    return false
  }

  // 直接上传文件到服务器
  uploadAvatarFile(file)
  return false
}

// 使用API上传头像文件
const uploadAvatarFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await uploadAvatar(formData)
    form.avatar = data.url
    $baseMessage('头像上传成功', 'success', 'hey')
  } catch (error) {
    $baseMessage('头像上传失败', 'error', 'hey')
  }
}

// 文件上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response) => {
  form.avatar = response.data.url
  $baseMessage('头像上传成功', 'success', 'hey')
}

// 文件上传失败
const handleUploadError: UploadProps['onError'] = () => {
  $baseMessage('头像上传失败', 'error', 'hey')
}

// 删除头像
const removeAvatar = () => {
  form.avatar = ''
  fileList.value = []
}

const showEdit = (row: any = {}) => {
  dialogFormVisible.value = true
  if (row.id) {
    title.value = '编辑团队'
    Object.assign(form, {
      id: row.id,
      name: row.name,
      avatar: row.avatar || '',
      description: row.description,
      memberIds: row.members ? row.members.map((m: any) => m.id) : [],
      order: row.order || 0,
    })

    // 如果有头像，设置文件列表
    if (row.avatar) {
      fileList.value = [
        {
          name: 'avatar.png',
          url: row.avatar,
        },
      ]
    }
  } else {
    title.value = '添加团队'
    Object.assign(form, {
      name: '',
      avatar: '',
      description: '',
      memberIds: [],
      order: 0,
    })
    fileList.value = []
  }
}

const close = () => {
  dialogFormVisible.value = false
  formRef.value?.resetFields()
}

const save = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const response = await doEdit(form)
        const msg = response.data?.msg || '保存成功'
        $baseMessage(msg, 'success', 'hey')
        dialogFormVisible.value = false
        $emit('fetch-data')
      } catch (error: any) {
        $baseMessage(error.message || '保存失败', 'error', 'hey')
      }
    }
  })
}

const opened = () => {
  formRef.value?.clearValidate()
}

defineExpose({
  showEdit,
})
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  display: block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.avatar-uploader .el-upload {
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
  border-radius: 50%;
}
</style>
