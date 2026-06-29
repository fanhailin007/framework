<template>
  <el-upload v-model:file-list="fileList" action="/uploadFile" :before-remove="beforeRemove" :limit="3" multiple :on-exceed="handleExceed">
    <el-button type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">jpg/png 文件需小于500kb</div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([])

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  $baseMessage(`限制为3个文件，您选择了${files.length}个文件，加起来总共${files.length + uploadFiles.length}个文件`, 'warning', 'hey')
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
  return new Promise((resolve) => {
    $baseConfirm(
      `是否取消上传 ${uploadFile.name} ？`,
      '确认删除',
      () => resolve(true),
      () => resolve(false)
    )
  })
}
</script>
