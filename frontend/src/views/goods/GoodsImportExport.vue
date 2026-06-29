<template>
  <div class="goods-import-export-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <div class="import-export-btns">
          <el-button :loading="exporting" type="primary" @click="handleExport">导出Excel</el-button>
          <el-upload accept=".xlsx,.xls" :before-upload="beforeUpload" :http-request="handleImport" :show-file-list="false">
            <el-button type="success">导入Excel</el-button>
          </el-upload>
        </div>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.name" clearable placeholder="请输入商品名称" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="loading" border :data="goodsList" style="width: 100%; margin-top: 16px">
      <el-table-column align="center" label="ID" prop="id" width="80" />
      <el-table-column align="center" label="商品名称" min-width="120" prop="name" />
      <el-table-column align="center" label="商品编码" min-width="120" prop="code" />
      <el-table-column align="center" label="价格" min-width="100" prop="price" />
      <el-table-column align="center" label="库存" min-width="100" prop="stock" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '上架' ? 'success' : row.status === '下架' ? 'info' : 'warning'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="160" prop="createTime" />
    </el-table>

    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { Refresh, Search } from '@element-plus/icons-vue'
import { exportGoods, getGoodsList, importGoods } from '/@/api/goodsImportExport'

const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  code: '',
  status: '',
})
const total = ref(0)
const goodsList = ref<any[]>([])
const loading = ref(false)
const exporting = ref(false)

async function fetchList() {
  loading.value = true
  try {
    const { data } = await getGoodsList(queryForm)
    goodsList.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

watch([() => queryForm.pageNo, () => queryForm.pageSize], fetchList, {
  immediate: true,
})

function handleSearch() {
  queryForm.pageNo = 1
  fetchList()
}

function handleSizeChange(val: number) {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchList()
}

function handleCurrentChange(val: number) {
  queryForm.pageNo = val
  fetchList()
}

function beforeUpload(file: File) {
  const isExcel = file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
  if (!isExcel) {
    $baseMessage('只能上传Excel文件', 'warning', 'hey')
  }
  return isExcel
}

async function handleImport({ file }: { file: File }) {
  const formData = new FormData()
  formData.append('file', file)
  try {
    await importGoods(formData)
    $baseMessage('导入成功', 'success', 'hey')
    fetchList()
  } catch {
    $baseMessage('导入失败', 'error', 'hey')
  }
}

async function handleExport() {
  exporting.value = true
  try {
    // mock环境下只提示导出成功，不做实际下载
    await exportGoods(queryForm)
    $baseMessage('导出成功', 'success', 'hey')
  } catch {
    $baseMessage('导出失败', 'error', 'hey')
  } finally {
    exporting.value = false
  }
}

const resetQueryForm = () => {
  ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
  })
  queryForm.pageNo = 1
  handleSearch()
}
</script>

<style scoped>
.goods-import-export-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.import-export-btns {
  display: flex;
  gap: 12px;
  align-items: center;
}

.import-export-btns .el-upload {
  vertical-align: top;
}
</style>
