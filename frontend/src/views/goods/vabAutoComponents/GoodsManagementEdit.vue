<template>
  <el-drawer v-model="dialogFormVisible" destroy-on-close :size="isSmallScreen ? '95%' : '500px'" :title="title">
    <el-form ref="formRef" class="goods-form" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model.trim="form.name" clearable />
      </el-form-item>
      <el-form-item label="商品分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择分类">
          <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品图" prop="images">
        <div class="goods-upload-container">
          <el-upload
            v-model:file-list="fileList"
            accept="image/*"
            action="/uploadFile"
            :before-upload="beforeUpload"
            drag
            :limit="5"
            list-type="text"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
            style="width: 100%"
          >
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将图片拖拽至此处或
              <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">支持 jpg/png/gif，最多5张，单张不超2MB</div>
            </template>
          </el-upload>
          <div v-if="form.images && form.images.length > 0" class="goods-preview-list">
            <img v-for="(img, idx) in form.images" :key="idx" class="goods-preview-img" :src="img" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="商品售价" prop="price">
        <el-input-number v-model="form.price" :min="0" :precision="2" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="form.stock" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio value="active">已上架</el-radio>
          <el-radio value="inactive">已下架</el-radio>
          <el-radio value="pending">待上架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否推荐" prop="isRecommend">
        <el-switch v-model="form.isRecommend" active-text="推荐" inactive-text="不推荐" />
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input v-model="form.description" placeholder="请输入商品描述" :rows="5" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, UploadRawFile, UploadUserFile } from 'element-plus'
import { doEdit } from '/@/api/goodsManagement'

const emit = defineEmits(['fetch-data'])

const formRef = ref<FormInstance>()
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)
const form = reactive<any>({})
const rules = reactive<any>({
  name: [{ required: true, trigger: 'blur', message: '请输入商品名称' }],
  categoryId: [{ required: true, trigger: 'change', message: '请选择商品分类' }],
  price: [{ required: true, trigger: 'blur', message: '请输入商品售价' }],
  stock: [{ required: true, trigger: 'blur', message: '请输入库存' }],
  status: [{ required: true, trigger: 'change', message: '请选择状态' }],
})
const categoryOptions = [
  { value: '1', label: '食品饮料' },
  { value: '2', label: '家用电器' },
  { value: '3', label: '其他' },
]
const fileList = ref<UploadUserFile[]>([])

const showEdit = (row: any) => {
  dialogFormVisible.value = true
  nextTick(() => {
    if (row) {
      title.value = '编辑'
      Object.assign(form, row)
      // 兼容images为字符串或数组
      fileList.value = (row.images || []).map((url: string, idx: number) => ({
        name: `图片${idx + 1}`,
        url,
      }))
    } else {
      title.value = '添加'
      Object.assign(form, {
        name: '',
        categoryId: '',
        images: [],
        price: '',
        stock: '',
        status: 'active',
        isRecommend: false,
        description: '',
      })
      fileList.value = []
    }
  })
}

defineExpose({
  showEdit,
})

const close = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  emit('fetch-data')
}

const handleUploadSuccess = (response: any, file: any, fileListArr: any) => {
  // 假设后端返回图片url
  form.images = fileListArr.map((f: any) => f.url || (f.response && f.response.url) || '')
}
const handleRemove = (file: any, fileListArr: any) => {
  form.images = fileListArr.map((f: any) => f.url || (f.response && f.response.url) || '')
}

const beforeUpload = (file: UploadRawFile) => {
  const isImage = (file as File).type?.startsWith('image/')
  const isLt2M = ((file as File).size || 0) / 1024 / 1024 < 2
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

const save = () => {
  form.images = fileList.value.map((f: any) => f.url)
  form.isRecommend = !!form.isRecommend
  form.price = Number(form.price)
  form.stock = Number(form.stock)
  form.status = form.status || 'active'
  form.categoryId = form.categoryId || ''
  form.description = form.description || ''
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      const { msg }: any = await doEdit(form)
      await $baseMessage(msg, 'success', 'hey')
      await close()
      dialogFormVisible.value = false
    }
  })
}

const isSmallScreen = ref(window.innerWidth <= 768)
const handleResize = () => {
  isSmallScreen.value = window.innerWidth <= 768
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.goods-form {
  width: 100%;
  padding: 10px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: -1px;
}

.goods-upload-container {
  width: 100%;
}

.goods-upload-container .el-upload {
  width: 100%;
}

.goods-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.goods-preview-img {
  max-width: 120px;
  max-height: 80px;
  object-fit: contain;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
