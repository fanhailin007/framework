<template>
  <div class="document-management-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="10">
        <el-button :icon="Plus" type="primary" @click="handleAdd">添加</el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete">批量删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="14">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.keyword" clearable placeholder="请输入标题/Slug/摘要/分类/标签" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryForm.status" clearable placeholder="状态" style="width: 120px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" v-loading="listLoading" border :data="list" @selection-change="setSelectRows">
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="文档ID" min-width="90" prop="documentId" />
      <el-table-column align="center" label="标题" min-width="180" prop="title" show-overflow-tooltip />
      <el-table-column align="center" label="Slug" min-width="180" prop="slug" show-overflow-tooltip />
      <el-table-column align="center" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.statusTagType">{{ row.statusLabel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类" min-width="120" prop="categoryLabel" show-overflow-tooltip />
      <el-table-column align="center" label="标签" min-width="160" prop="tagsText" show-overflow-tooltip />
      <el-table-column align="center" label="文件大小" min-width="100" prop="fileSizeText" />
      <el-table-column align="center" label="版本" min-width="80" prop="version" />
      <el-table-column align="center" label="发布时间" min-width="170" prop="publishedAt" show-overflow-tooltip />
      <el-table-column align="center" label="更新时间" min-width="170" prop="updatedAt" show-overflow-tooltip />
      <el-table-column align="center" fixed="right" label="操作" width="260">
        <template #default="{ row }">
          <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button :disabled="row.status === 'published'" text type="success" @click="handlePublish(row)">发布</el-button>
          <el-button :disabled="row.status === 'archived'" text type="warning" @click="handleArchive(row)">归档</el-button>
          <el-button :disabled="!row.filePath" text type="primary" @click="handleOpenPdf(row)">查看</el-button>
          <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <vab-pagination
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <document-edit-dialog ref="editRef" @saved="fetchData" />
    <vab-dialog v-model="pdfDialogVisible" append-to-body :title="pdfTitle" width="80%" @close="closePdfDialog">
      <div v-loading="pdfLoading" class="document-pdf-preview">
        <iframe v-if="pdfSource" class="document-pdf-frame" :src="pdfSource" title="PDF预览" />
        <el-empty v-else-if="!pdfLoading" description="暂无PDF文件" />
      </div>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { doArchive, doDelete, doPublish, getList, getPdfBlob } from '/@/api/documentManagement'
import { documentConfig } from '/@/config/data.config'
import { normalizeDocumentListResponse } from '/@/utils/documentManagementContract'
import DocumentEditDialog from '/@vab/components/DocumentEditDialog/index.vue'

defineOptions({
  name: 'DocumentManagement',
})

const tableRef = ref<TableInstance>()
const editRef = ref<any>(null)
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const selectRows = ref<any>([])
const statusOptions = documentConfig.statusOptions
const pdfDialogVisible = ref<boolean>(false)
const pdfLoading = ref<boolean>(false)
const pdfSource = ref<string>('')
const pdfTitle = ref<string>('PDF预览')
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  keyword: '',
  status: '',
})

const setSelectRows = (value: any[]) => {
  selectRows.value = value
}

const handleAdd = () => {
  editRef.value.showEdit()
}

const handleEdit = (row: any = {}) => {
  editRef.value.showEdit(row)
}

const handleDelete = (row: any = {}) => {
  if (row.id) {
    $baseConfirm('您确定要删除当前项吗', null, async () => {
      const { msg }: any = await doDelete({ ids: row.id })
      $baseMessage(msg, 'success', 'hey')
      await fetchData()
    })
  } else if (selectRows.value.length > 0) {
    const ids = selectRows.value.map((item: { id: any }) => item.id).join(',')
    $baseConfirm('您确定要删除选中项吗', null, async () => {
      const { msg }: any = await doDelete({ ids })
      $baseMessage(msg, 'success', 'hey')
      await fetchData()
    })
  } else {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  }
}

const handlePublish = (row: any) => {
  $baseConfirm('您确定要发布当前文档吗', null, async () => {
    await doPublish(row.id)
    $baseMessage('发布成功', 'success', 'hey')
    await fetchData()
  })
}

const handleArchive = (row: any) => {
  $baseConfirm('您确定要归档当前文档吗', null, async () => {
    await doArchive(row.id)
    $baseMessage('归档成功', 'success', 'hey')
    await fetchData()
  })
}

const handleOpenPdf = async (row: any) => {
  pdfDialogVisible.value = true
  pdfLoading.value = true
  pdfTitle.value = row.title ? `${row.title} - PDF预览` : 'PDF预览'
  if (pdfSource.value) URL.revokeObjectURL(pdfSource.value)
  pdfSource.value = ''
  try {
    const blob = await getPdfBlob(row.id)
    pdfSource.value = URL.createObjectURL(blob)
  } finally {
    pdfLoading.value = false
  }
}

const closePdfDialog = () => {
  if (pdfSource.value) URL.revokeObjectURL(pdfSource.value)
  pdfSource.value = ''
  pdfLoading.value = false
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const resetQueryForm = () => {
  ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
  })
  queryForm.pageNo = 1
  queryData()
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const response = await getList(queryForm)
    const data = normalizeDocumentListResponse(response, queryForm)
    list.value = data.list
    total.value = data.total
  } finally {
    listLoading.value = false
  }
}

onActivated(() => {
  tableRef.value?.doLayout()
})

onBeforeMount(() => {
  fetchData()
})

onBeforeUnmount(() => {
  closePdfDialog()
})
</script>

<style lang="scss" scoped>
.document-pdf-preview {
  min-height: 70vh;
}

.document-pdf-frame {
  width: 100%;
  height: 70vh;
  border: 0;
}
</style>
