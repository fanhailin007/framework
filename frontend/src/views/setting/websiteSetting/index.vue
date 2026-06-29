<template>
  <div class="website-setting-container no-background-container">
    <el-row :gutter="20">
      <el-col :lg="12" :md="20" :sm="24" :xl="10" :xs="24">
        <vab-card title="网站设置">
          <el-form ref="formRef" v-loading="loading" label-width="100px" :model="form" :rules="formRules" @submit="submitForm">
            <el-form-item label="网站名称" prop="siteName">
              <el-input v-model="form.siteName" clearable placeholder="请输入网站名称" />
            </el-form-item>

            <el-form-item label="网站Logo" prop="logo">
              <div class="logo-upload-container">
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
                    将logo拽至此处或
                    <em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">支持 jpg/png/gif 格式，文件大小不超过 2MB</div>
                  </template>
                </el-upload>
                <div v-if="form.logo" class="logo-preview">
                  <img alt="Logo预览" :src="form.logo" />
                  <el-button size="small" type="danger" @click="removeLogo">删除</el-button>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="网站地址" prop="siteUrl">
              <el-input v-model="form.siteUrl" clearable placeholder="请输入网站地址" />
            </el-form-item>

            <el-form-item label="网站描述" prop="description">
              <el-input v-model="form.description" maxlength="200" placeholder="请输入网站描述" :rows="3" show-word-limit type="textarea" />
            </el-form-item>

            <el-form-item label="META关键词" prop="metaKeywords">
              <el-input v-model="form.metaKeywords" clearable placeholder="请输入META关键词，多个关键词用逗号分隔" />
            </el-form-item>

            <el-form-item label="META描述" prop="metaDesc">
              <el-input v-model="form.metaDesc" maxlength="300" placeholder="请输入META描述" :rows="3" show-word-limit type="textarea" />
            </el-form-item>

            <el-form-item label="版权信息" prop="copyright">
              <el-input v-model="form.copyright" clearable placeholder="请输入版权信息" />
            </el-form-item>

            <el-form-item label="ICP备案号" prop="icp">
              <el-input v-model="form.icp" clearable placeholder="请输入ICP备案号" />
            </el-form-item>

            <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input v-model="form.contactEmail" clearable placeholder="请输入联系邮箱" />
            </el-form-item>

            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" clearable placeholder="请输入联系电话" />
            </el-form-item>

            <el-form-item label="公司地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入公司地址" :rows="2" type="textarea" />
            </el-form-item>

            <el-form-item>
              <el-button :loading="saving" type="primary" @click="submitForm">保存设置</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, UploadProps, UploadUserFile } from 'element-plus'
import { getWebsiteSetting, saveWebsiteSetting } from '/@/api/websiteSetting'

defineOptions({
  name: 'WebsiteSetting',
})

interface FormType {
  siteName: string
  siteUrl: string
  logo: string
  metaKeywords: string
  metaDesc: string
  copyright: string
  icp: string
  contactEmail: string
  contactPhone: string
  address: string
  description: string
}

const form = reactive<FormType>({
  siteName: '',
  siteUrl: '',
  logo: '',
  metaKeywords: '',
  metaDesc: '',
  copyright: '',
  icp: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  description: '',
})

const fileList = ref<UploadUserFile[]>([])
const formRef = ref<FormInstance>()
const loading = ref<boolean>(false)
const saving = ref<boolean>(false)

// 上传相关配置
const uploadAction = '/websiteSetting/uploadFile'
const uploadHeaders = {
  // 如果需要认证，可以在这里添加token
}

const formRules = reactive<any>({
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    {
      min: 2,
      max: 50,
      message: '网站名称长度在 2 到 50 个字符',
      trigger: 'blur',
    },
  ],
  siteUrl: [
    { required: true, message: '请输入网站地址', trigger: 'blur' },
    {
      pattern: /^https?:\/\/.*/,
      message: '请输入正确的网址格式，如：https://example.com',
      trigger: 'blur',
    },
  ],
  description: [
    { required: true, message: '请输入网站描述', trigger: 'blur' },
    {
      min: 10,
      max: 200,
      message: '网站描述长度在 10 到 200 个字符',
      trigger: 'blur',
    },
  ],
  metaKeywords: [
    { required: true, message: '请输入META关键词', trigger: 'blur' },
    {
      min: 2,
      max: 100,
      message: 'META关键词长度在 2 到 100 个字符',
      trigger: 'blur',
    },
  ],
  metaDesc: [
    { required: true, message: '请输入META描述', trigger: 'blur' },
    {
      min: 10,
      max: 300,
      message: 'META描述长度在 10 到 300 个字符',
      trigger: 'blur',
    },
  ],
  copyright: [{ required: true, message: '请输入版权信息', trigger: 'blur' }],
  contactEmail: [
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '请输入正确的邮箱格式',
      trigger: 'blur',
    },
  ],
  contactPhone: [
    {
      pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/,
      message: '请输入正确的电话号码格式',
      trigger: 'blur',
    },
  ],
})

// 获取网站设置
const fetchSetting = async () => {
  try {
    loading.value = true
    const { data } = await getWebsiteSetting()
    Object.assign(form, data)

    // 如果有logo，设置文件列表
    if (data.logo) {
      fileList.value = [
        {
          name: 'logo.png',
          url: data.logo,
        },
      ]
    }
  } catch (error) {
    console.error('获取网站设置失败:', error)
    $baseMessage('获取网站设置失败', 'error', 'hey')
  } finally {
    loading.value = false
  }
}

// 提交表单
const submitForm = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (valid) {
      saving.value = true
      await saveWebsiteSetting(form)
      $baseMessage('网站设置保存成功', 'success', 'hey')
    }
  } catch (error) {
    console.error('保存网站设置失败:', error)
    $baseMessage('保存网站设置失败', 'error', 'hey')
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  fetchSetting()
}

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
  return true
}

// 文件上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response) => {
  form.logo = response.data.url
  $baseMessage('Logo上传成功', 'success', 'hey')
}

// 文件上传失败
const handleUploadError: UploadProps['onError'] = () => {
  $baseMessage('Logo上传失败', 'error', 'hey')
}

// 删除Logo
const removeLogo = () => {
  form.logo = ''
  fileList.value = []
}

// 页面加载时获取数据
onMounted(() => {
  fetchSetting()
})
</script>

<style lang="scss" scoped>
.website-setting-container {
  .logo-upload-container {
    .logo-preview {
      margin-top: 10px;
      text-align: center;

      img {
        max-width: 200px;
        max-height: 100px;
        margin-bottom: 10px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
      }
    }
  }
}
</style>
