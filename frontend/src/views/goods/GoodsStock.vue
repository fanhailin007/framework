<template>
  <div class="goods-stock-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button :icon="Plus" type="primary" @click="openDialog('add')">添加</el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete">删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.goodsName" clearable placeholder="商品名称" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" native-type="submit" type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableRef" v-loading="loading" border :data="stockList" @selection-change="setSelectRows">
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称" min-width="120" prop="goodsName" />
      <el-table-column align="center" label="商品编码" prop="goodsCode" width="120" />
      <el-table-column align="center" label="分类" prop="category" width="100" />
      <el-table-column align="center" label="当前库存" prop="currentStock" sortable width="100" />
      <el-table-column align="center" label="预警值" prop="minStock" width="100" />
      <el-table-column align="center" label="最大库存" prop="maxStock" width="100" />
      <el-table-column align="center" label="单位" prop="unit" width="80" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag effect="dark" :type="row.status === '正常' ? 'success' : row.status === '库存不足' ? 'danger' : 'warning'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" min-width="160" prop="lastUpdateTime" />
      <el-table-column align="center" label="仓库" prop="warehouse" width="100" />
      <el-table-column align="center" label="操作" width="150">
        <template #default="{ row }">
          <el-button text type="primary" @click="openDialog('edit', row)">编辑</el-button>
          <el-button text type="danger" @click="deleteStock(row.id)">删除</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <vab-dialog
      :model-value="dialogVisible"
      :title="dialogMode === 'add' ? '添加库存' : '编辑库存'"
      width="500px"
      @update:model-value="(val) => (dialogVisible = val)"
    >
      <el-form ref="formRef" l label-width="100px" :model="form" :rules="rules">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品编码" prop="goodsCode">
          <el-input v-model="form.goodsCode" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="服装鞋帽" value="服装鞋帽" />
            <el-option label="食品饮料" value="食品饮料" />
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存" prop="currentStock">
          <el-input v-model="form.currentStock" placeholder="请输入当前库存" />
        </el-form-item>
        <el-form-item label="预警值" prop="minStock">
          <el-input v-model="form.minStock" placeholder="请输入库存预警值" />
        </el-form-item>
        <el-form-item label="最大库存" prop="maxStock">
          <el-input v-model="form.maxStock" placeholder="请输入最大库存" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit" placeholder="请选择单位">
            <el-option label="个" value="个" />
            <el-option label="件" value="件" />
            <el-option label="台" value="台" />
            <el-option label="包" value="包" />
            <el-option label="瓶" value="瓶" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="正常" value="正常" />
            <el-option label="库存不足" value="库存不足" />
            <el-option label="库存积压" value="库存积压" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouse">
          <el-select v-model="form.warehouse" placeholder="请选择仓库">
            <el-option label="主仓库" value="主仓库" />
            <el-option label="分仓A" value="分仓A" />
            <el-option label="分仓B" value="分仓B" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { doGoodsStockDelete, doGoodsStockEdit, getGoodsStockList } from '/@/api/goodsStock'

interface StockItem {
  id?: string
  goodsName: string
  goodsCode: string
  category: string
  currentStock: string
  minStock: string
  maxStock: string
  unit: string
  status: string
  lastUpdateTime?: string
  warehouse: string
}

defineOptions({
  name: 'GoodsStock',
})

const tableRef = ref<TableInstance>()
const selectRows = ref<any>([])

const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  goodsName: '',
  status: '',
})
const total = ref(0)
const stockList = ref<StockItem[]>([])
const loading = ref(false)

onActivated(() => {
  tableRef.value?.doLayout()
})

async function fetchList() {
  loading.value = true
  const { data } = await getGoodsStockList(queryForm)
  stockList.value = data.list
  total.value = data.total
  loading.value = false
}

watch([() => queryForm.pageNo, () => queryForm.pageSize], fetchList, {
  immediate: true,
})

const setSelectRows = (value: string) => {
  selectRows.value = value
}

const handleSearch = () => {
  queryForm.pageNo = 1
  fetchList()
}

const resetQueryForm = () => {
  ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
  })
  queryForm.pageNo = 1
  fetchList()
}

const handleDelete = () => {
  if (selectRows.value.length > 0) {
    const ids = selectRows.value.map((item: { id: any }) => item.id).join(',')
    $baseConfirm('您确定要删除选中项吗', null, async () => {
      try {
        await doGoodsStockDelete({ ids })
        $baseMessage('删除成功', 'success', 'hey')
        fetchList()
      } catch (error) {
        console.error('删除失败:', error)
        $baseMessage('删除失败', 'error', 'hey')
      }
    })
  } else {
    $baseMessage('您未选中任何行', 'warning', 'hey')
  }
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

// 弹窗表单
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = reactive<StockItem>({
  id: '',
  goodsName: '',
  goodsCode: '',
  category: '',
  currentStock: '',
  minStock: '',
  maxStock: '',
  unit: '',
  status: '正常',
  warehouse: '',
})

const rules = {
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  goodsCode: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  currentStock: [{ required: true, message: '请输入当前库存', trigger: 'blur' }],
  minStock: [{ required: true, message: '请输入库存预警值', trigger: 'blur' }],
  maxStock: [{ required: true, message: '请输入最大库存', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  warehouse: [{ required: true, message: '请选择仓库', trigger: 'change' }],
}

function openDialog(mode: 'add' | 'edit', row?: StockItem) {
  dialogMode.value = mode
  dialogVisible.value = true
  if (mode === 'edit' && row) {
    Object.assign(form, row)
  } else {
    Object.assign(form, {
      id: '',
      goodsName: '',
      goodsCode: '',
      category: '',
      currentStock: '',
      minStock: '',
      maxStock: '',
      unit: '',
      status: '正常',
      warehouse: '',
    })
  }
  nextTick(() => formRef.value?.clearValidate())
}

function submitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    await doGoodsStockEdit(form)
    $baseMessage(dialogMode.value === 'add' ? '添加成功' : '编辑成功', 'success', 'hey')
    dialogVisible.value = false
    fetchList()
  })
}

async function deleteStock(id: string) {
  $baseConfirm('您确定要删除当前项吗', null, async () => {
    try {
      await doGoodsStockDelete({ id })
      $baseMessage('删除成功', 'success', 'hey')
      fetchList()
    } catch (error) {
      console.error('删除失败:', error)
      $baseMessage('删除失败', 'error', 'hey')
    }
  })
}
</script>

<style scoped>
.goods-stock-container {
  padding: 24px;
}
</style>
