<template>
  <div class="excel-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <excel-import @import-error="handleImportError" @import-success="handleImportSuccess">
          <template #import-text>导入 Excel</template>
        </excel-import>
        <excel-export
          :data="tableData"
          filename="导出的数据"
          :headers="headers"
          sheet-name="导出的列表"
          @export-error="handleExportError"
          @export-success="handleExportSuccess"
        >
          导出 Excel
        </excel-export>
        <el-button type="danger" @click="handleClear">清除数据</el-button>
        <el-button type="primary" @click="handleReset">还原数据</el-button>
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table :data="tableData">
      <el-table-column v-for="key in Object.keys(headers)" :key="key" :label="headers[key as keyof typeof headers]" :prop="key" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
const ExcelExport = defineAsyncComponent(() => import('./components/ExcelExport.vue'))
const ExcelImport = defineAsyncComponent(() => import('./components/ExcelImport.vue'))

defineOptions({
  name: 'Excel',
})

interface TableData {
  name: string
  age: number
  city: string
}

const handleImportSuccess = (data: any[]) => {
  const formattedData = data.map((item) => ({
    name: item['姓名'],
    age: Number(item['年龄']),
    city: item['城市'],
  }))
  tableData.value = formattedData
  $baseMessage('导入成功', 'success')
}

const handleImportError = (error: Error) => {
  $baseMessage(`导入失败: ${error.message}`, 'error')
}

const tableData = ref<TableData[]>([
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
  {
    name: '王小虎',
    city: '普陀区',
    age: 18,
  },
])
const oldTableData = [...tableData.value]

const headers = {
  name: '姓名',
  age: '年龄',
  city: '城市',
}

const handleExportSuccess = () => {
  $baseMessage('导出成功', 'success')
}

const handleExportError = (error: Error) => {
  $baseMessage(`导出失败: ${error.message}`, 'error')
}

const handleClear = () => {
  tableData.value = []
}

const handleReset = () => {
  tableData.value = oldTableData
}
</script>
