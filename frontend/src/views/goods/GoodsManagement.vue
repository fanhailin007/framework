<template>
  <div class="goods-management-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="10">
        <el-button :icon="Plus" type="primary" @click="handleAdd">添加</el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete">删除</el-button>
        <el-dropdown>
          <el-button type="primary">
            批量操作
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="batchStatus('active')">批量上架</el-dropdown-item>
              <el-dropdown-item @click="batchStatus('inactive')">批量下架</el-dropdown-item>
              <el-dropdown-item @click="batchSetRecommend(true)">批量推荐</el-dropdown-item>
              <el-dropdown-item @click="batchSetRecommend(false)">批量取消推荐</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="14">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.name" clearable placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryForm.categoryId" clearable placeholder="商品分类">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryForm.status" clearable placeholder="状态">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryForm.isRecommend" clearable placeholder="是否推荐">
              <el-option v-for="item in recommendOptions" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData">查询</el-button>
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
      <el-table-column align="center" label="商品ID" min-width="120" prop="id" show-overflow-tooltip />
      <el-table-column align="center" label="商品名称" min-width="120" prop="name" />
      <el-table-column align="center" label="商品分类" min-width="100" prop="category">
        <template #default="{ row }">
          {{ row.category || '-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品图" prop="images">
        <template #default="{ row }">
          <el-carousel v-if="row.images && row.images.length > 1" arrow="hover" height="60px" indicator-position="none">
            <el-carousel-item v-for="(img, idx) in row.images" :key="idx">
              <el-image :src="img" style="width: 60px; height: 60px; object-fit: cover" />
            </el-carousel-item>
          </el-carousel>
          <el-image v-else :src="row.images && row.images[0] ? row.images[0] : ''" style="width: 60px; height: 60px; object-fit: cover" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="售价" min-width="100" prop="price" sortable>
        <template #default="{ row }">￥{{ row.price }}</template>
      </el-table-column>
      <el-table-column align="center" label="销量" prop="sales" sortable />
      <el-table-column align="center" label="库存" prop="stock" sortable />
      <el-table-column align="center" label="状态" min-width="100" prop="status" sortable>
        <template #default="{ row }">
          <el-tag effect="dark" :type="row.status === 'active' ? 'success' : row.status === 'pending' ? 'warning' : 'info'">
            {{ row.status === 'active' ? '已上架' : row.status === 'pending' ? '待上架' : '已下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否推荐" min-width="100" prop="isRecommend">
        <template #default="{ row }">
          <el-icon v-if="row.isRecommend">
            <star-filled style="color: #f7ba2a" />
          </el-icon>
          <el-icon v-else>
            <star />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" min-width="160" prop="datetime" />
      <el-table-column align="center" label="操作" width="180">
        <template #default="{ row }">
          <el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
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
    <goods-management-edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Delete, Plus, Refresh, Search, Star, StarFilled } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { batchRecommend, batchUpdateStatus, doDelete, getList } from '/@/api/goodsManagement'

defineOptions({
  name: 'GoodsManagement',
})

const editRef = ref<any>(null)
const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const selectRows = ref<any>([])
const categoryOptions = [
  { label: '食品饮料', value: '1' },
  { label: '家用电器', value: '2' },
  { label: '其他', value: '3' },
]
const statusOptions = [
  { label: '已上架', value: 'active' },
  { label: '已下架', value: 'inactive' },
  { label: '待上架', value: 'pending' },
]
const recommendOptions = [
  { label: '全部', value: '' },
  { label: '推荐', value: true },
  { label: '不推荐', value: false },
]
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
  categoryId: '',
  status: '',
  isRecommend: '',
  name: '',
})

onActivated(() => {
  tableRef.value?.doLayout()
})

const fetchData = async () => {
  listLoading.value = true
  const { data } = await getList(queryForm)
  list.value = data.list
  total.value = data.total
  listLoading.value = false
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

const setSelectRows = (value: string) => {
  selectRows.value = value
}

const handleAdd = () => {
  editRef.value.showEdit()
}

const handleEdit = (row = {}) => {
  editRef.value.showEdit(row)
}

const handleDelete = (row: any) => {
  if (row.id) {
    $baseConfirm('您确定要删除当前项吗', null, async () => {
      const { msg }: any = await doDelete({ ids: row.id })
      $baseMessage(msg, 'success', 'hey')
      await fetchData()
    })
  } else {
    if (selectRows.value.length > 0) {
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
}

const resetQueryForm = () => {
  Object.keys(queryForm).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = ''
  })
  queryForm.pageNo = 1
  fetchData()
}

const batchStatus = async (status: string) => {
  if (selectRows.value.length === 0) {
    $baseMessage('请先选择商品', 'warning', 'hey')
    return
  }
  const ids = selectRows.value.map((item: { id: any }) => item.id)
  await batchUpdateStatus({ ids, status })
  $baseMessage('批量操作成功', 'success', 'hey')
  fetchData()
}

const batchSetRecommend = async (isRecommend: boolean) => {
  if (selectRows.value.length === 0) {
    $baseMessage('请先选择商品', 'warning', 'hey')
    return
  }
  const ids = selectRows.value.map((item: { id: any }) => item.id)
  await batchRecommend({ ids, isRecommend })
  $baseMessage('批量操作成功', 'success', 'hey')
  fetchData()
}

onBeforeMount(() => {
  fetchData()
})
</script>
