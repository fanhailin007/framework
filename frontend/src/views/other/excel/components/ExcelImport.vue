<template>
  <div class="excel-uploader">
    <el-upload accept=".xlsx, .xls" :auto-upload="false" :show-file-list="false" @change="handleFileChange">
      <el-button type="primary">
        <slot name="import-text">导入Excel</slot>
      </el-button>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
/* stylelint-disable-next-line CssSyntaxError */
import type { UploadFile } from 'element-plus'
import * as XLSX from 'xlsx'

async function importExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const results = XLSX.utils.sheet_to_json(worksheet)
        resolve(results)
      } catch (error) {
        reject(error)
      }
    })

    reader.onerror = (error) => reject(error)

    reader.readAsArrayBuffer(file)
  })
}

const emit = defineEmits<{
  'import-success': [data: any[]]
  'import-error': [error: Error]
}>()

const handleFileChange = async (uploadFile: UploadFile) => {
  try {
    if (!uploadFile.raw) return
    const results = await importExcel(uploadFile.raw)
    emit('import-success', results)
  } catch (error) {
    emit('import-error', error as Error)
  }
}
</script>

<style scoped>
.excel-uploader {
  margin-top: -10px;
  margin-right: 10px;
}
</style>
