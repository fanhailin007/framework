<template>
  <vab-dialog v-model="dialogFormVisible" append-to-body :title="title" width="1100px" @close="close">
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <div class="document-edit-layout">
        <div class="document-edit-fields">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="form.title" clearable />
          </el-form-item>
          <el-form-item label="Slug" prop="slug">
            <el-input v-model.trim="form.slug" clearable @input="handleSlugInput" />
          </el-form-item>
          <el-form-item label="摘要" prop="summary">
            <el-input v-model.trim="form.summary" clearable maxlength="512" show-word-limit type="textarea" />
          </el-form-item>
          <el-form-item label="正文" prop="content">
            <el-input v-model="form.content" :autosize="{ minRows: 8, maxRows: 14 }" clearable type="textarea" />
          </el-form-item>
          <el-form-item label="分类" prop="category">
            <el-select v-model="form.category" allow-create clearable filterable placeholder="请选择或输入分类">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="tags">
            <el-select v-model="form.tags" allow-create clearable filterable multiple placeholder="请选择或输入标签">
              <el-option v-for="item in tagOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!form.id" label="PDF文件" prop="file">
            <el-upload
              ref="uploadRef"
              v-model:file-list="fileList"
              accept="application/pdf"
              :auto-upload="false"
              :limit="1"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
            >
              <el-button>选择文件</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div class="document-edit-preview">
          <iframe v-if="pdfPreviewSource" class="document-upload-pdf-frame" :src="pdfPreviewSource" title="PDF预览" />
          <el-empty v-else description="暂无PDF预览" />
        </div>
      </div>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </vab-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, UploadFile, UploadInstance, UploadUserFile } from 'element-plus'
import { doEdit, doUpload } from '/@/api/documentManagement'
import { documentConfig } from '/@/config/data.config'
import { createDocumentSlug } from '/@/utils/documentManagementContract'

defineOptions({
  name: 'DocumentEditDialog',
})

const emit = defineEmits(['fetch-data', 'saved', 'closed'])

const formRef = ref<FormInstance>()
const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([])
const form = reactive<any>({
  id: undefined,
  title: '',
  slug: '',
  summary: '',
  content: '',
  category: '',
  tags: [],
  file: undefined,
})
const rules = reactive<any>({
  title: [{ required: true, trigger: 'blur', message: '请输入标题' }],
  slug: [{ required: true, trigger: 'blur', message: '请输入Slug' }],
})
const title = ref<string>('')
const dialogFormVisible = ref<boolean>(false)
const pdfPreviewSource = ref<string>('')
const slugTouched = ref<boolean>(false)
const lastAutoSlug = ref<string>('')
const categoryOptions = documentConfig.categoryOptions
const tagOptions = ['seed', 'draft', 'published', 'postman', 'pdf', 'guide']

const showEdit = (row?: any) => {
  dialogFormVisible.value = true
  nextTick(() => {
    if (row) {
      title.value = '编辑'
      Object.assign(form, {
        id: row.id,
        title: row.title || '',
        slug: row.slug || '',
        summary: row.summary || '',
        content: row.content || '',
        category: row.category || '',
        tags: [...(row.tags || [])],
        file: undefined,
      })
      slugTouched.value = true
    } else {
      title.value = '添加'
      slugTouched.value = false
    }
  })
}

defineExpose({
  showEdit,
})

const releasePdfPreview = () => {
  if (pdfPreviewSource.value) URL.revokeObjectURL(pdfPreviewSource.value)
  pdfPreviewSource.value = ''
}

const applyAutoSlug = (value?: string | null) => {
  if (form.id || slugTouched.value) return
  const slug = createDocumentSlug(value)
  if (!slug) return
  form.slug = slug
  lastAutoSlug.value = slug
}

const handleSlugInput = () => {
  slugTouched.value = form.slug !== '' && form.slug !== lastAutoSlug.value
}

const handleFileChange = (uploadFile: UploadFile) => {
  form.file = uploadFile.raw
  releasePdfPreview()
  if (form.file) {
    pdfPreviewSource.value = URL.createObjectURL(form.file)
    if (!form.title) applyAutoSlug(uploadFile.name)
  }
}

const handleFileRemove = () => {
  form.file = undefined
  releasePdfPreview()
}

const resetForm = () => {
  releasePdfPreview()
  Object.assign(form, {
    id: undefined,
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: '',
    tags: [],
    file: undefined,
  })
  slugTouched.value = false
  lastAutoSlug.value = ''
  fileList.value = []
  uploadRef.value?.clearFiles()
}

const close = () => {
  formRef.value?.clearValidate()
  resetForm()
  emit('closed')
}

const save = () => {
  formRef.value?.validate(async (valid: any) => {
    if (valid) {
      if (form.file) await doUpload(form)
      else await doEdit(form)
      await $baseMessage('保存成功', 'success', 'hey')
      emit('saved')
      emit('fetch-data')
      await close()
      dialogFormVisible.value = false
    }
  })
}

onBeforeUnmount(() => {
  releasePdfPreview()
})

watch(
  () => form.title,
  (value) => {
    applyAutoSlug(value)
  }
)
</script>

<style lang="scss" scoped>
.document-edit-layout {
  display: grid;
  grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.document-edit-fields {
  min-width: 0;
}

.document-edit-preview {
  min-width: 0;
  min-height: 620px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.document-upload-pdf-frame {
  display: block;
  width: 100%;
  height: 620px;
  border: 0;
}

@media (width <= 900px) {
  .document-edit-layout {
    grid-template-columns: 1fr;
  }

  .document-edit-preview,
  .document-upload-pdf-frame {
    min-height: 420px;
    height: 420px;
  }
}
</style>
