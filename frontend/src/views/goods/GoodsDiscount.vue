<template>
  <div class="goods-discount-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="openDialog('add')">添加限时折扣</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.activityName" clearable placeholder="活动名称" @keyup.enter="handleSearch" />
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

    <el-table v-loading="loading" border :data="discountList" style="width: 100%; margin-top: 16px">
      <el-table-column align="center" label="ID" prop="id" width="80" />
      <el-table-column align="center" label="活动名称" min-width="120" prop="activityName" />
      <el-table-column align="center" label="商品名称" min-width="120" prop="goodsName" />
      <el-table-column align="center" label="商品编码" prop="goodsCode" width="120" />
      <el-table-column align="center" label="折扣价" prop="discountPrice" width="100" />
      <el-table-column align="center" label="原价" prop="originPrice" width="100" />
      <el-table-column align="center" label="库存" prop="stock" width="80" />
      <el-table-column align="center" label="活动时间" min-width="200">
        <template #default="{ row }">
          <span>{{ row.startTime }} ~ {{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.status === '进行中' ? 'success' : row.status === '未开始' ? 'info' : row.status === '已结束' ? 'danger' : 'warning'"
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" min-width="160" prop="updateTime" />
      <el-table-column align="center" label="操作" width="160">
        <template #default="{ row }">
          <el-button size="small" text type="primary" @click="openDialog('edit', row)">编辑</el-button>
          <el-button size="small" text type="danger" @click="deleteDiscount(row.id)">删除</el-button>
        </template>
      </el-table-column>
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
      :title="dialogMode === 'add' ? '添加限时折扣' : '编辑限时折扣'"
      width="500px"
      @update:model-value="(val) => (dialogVisible = val)"
    >
      <el-form ref="formRef" l label-width="100px" :model="form" :rules="rules">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品编码" prop="goodsCode">
          <el-input v-model="form.goodsCode" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="折扣价" prop="discountPrice">
          <el-input v-model="form.discountPrice" placeholder="请输入折扣价" />
        </el-form-item>
        <el-form-item label="原价" prop="originPrice">
          <el-input v-model="form.originPrice" placeholder="请输入原价" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-date-picker
            v-model="dateRange"
            end-placeholder="结束时间"
            start-placeholder="开始时间"
            style="width: 100%"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已结束" value="已结束" />
            <el-option label="已停用" value="已停用" />
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
import { Refresh, Search } from '@element-plus/icons-vue'
import { doGoodsDiscountDelete, doGoodsDiscountEdit, getGoodsDiscountList } from '/@/api/goodsDiscount'

interface DiscountItem {
  id?: string
  activityName: string
  goodsName: string
  goodsCode: string
  discountPrice: string
  originPrice: string
  stock: string
  startTime: string
  endTime: string
  status: string
  updateTime?: string
}

const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  activityName: '',
  goodsName: '',
  status: '',
})
const total = ref(0)
const discountList = ref<DiscountItem[]>([])
const loading = ref(false)

async function fetchList() {
  loading.value = true
  const { data } = await getGoodsDiscountList(queryForm)
  discountList.value = data.list
  total.value = data.total
  loading.value = false
}

watch([() => queryForm.pageNo, () => queryForm.pageSize], fetchList, {
  immediate: true,
})

function handleSizeChange(val: number) {
  queryForm.pageNo = 1
  queryForm.pageSize = val
  fetchList()
}

function handleCurrentChange(val: number) {
  queryForm.pageNo = val
  fetchList()
}

function handleSearch() {
  queryForm.pageNo = 1
  fetchList()
}

function resetQueryForm() {
  queryForm.activityName = ''
  queryForm.goodsName = ''
  queryForm.status = ''
  queryForm.pageNo = 1
  fetchList()
}

// 弹窗表单
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = reactive<DiscountItem>({
  id: '',
  activityName: '',
  goodsName: '',
  goodsCode: '',
  discountPrice: '',
  originPrice: '',
  stock: '',
  startTime: '',
  endTime: '',
  status: '未开始',
})
const dateRange = ref<[string, string] | []>([])

const rules = {
  activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  goodsCode: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
  discountPrice: [{ required: true, message: '请输入折扣价', trigger: 'blur' }],
  originPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function openDialog(mode: 'add' | 'edit', row?: DiscountItem) {
  dialogMode.value = mode
  dialogVisible.value = true
  if (mode === 'edit' && row) {
    Object.assign(form, row)
    dateRange.value = [row.startTime, row.endTime]
  } else {
    Object.assign(form, {
      id: '',
      activityName: '',
      goodsName: '',
      goodsCode: '',
      discountPrice: '',
      originPrice: '',
      stock: '',
      startTime: '',
      endTime: '',
      status: '未开始',
    })
    dateRange.value = []
  }
  nextTick(() => formRef.value?.clearValidate())
}

function submitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    if (dateRange.value.length === 2) {
      form.startTime = dateRange.value[0]
      form.endTime = dateRange.value[1]
    }
    await doGoodsDiscountEdit(form)
    $baseMessage(dialogMode.value === 'add' ? '添加成功' : '编辑成功', 'success', 'hey')
    dialogVisible.value = false
    fetchList()
  })
}

async function deleteDiscount(id: string) {
  await doGoodsDiscountDelete({ id })
  $baseMessage('删除成功', 'success', 'hey')
  // 删除后如果当前页没数据自动跳到上一页
  if (discountList.value.length === 1 && queryForm.pageNo > 1) {
    queryForm.pageNo--
  } else {
    fetchList()
  }
}
</script>

<style scoped>
.goods-discount-container {
  padding: 24px;
}
</style>
