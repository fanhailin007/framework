<template>
  <div class="goods-coupon-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="openDialog('add')">添加优惠券</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item label="">
            <el-input v-model="queryForm.name" clearable placeholder="请输入优惠券名称" @keyup.enter="handleSearch" />
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

    <el-table v-loading="loading" border :data="couponList" style="width: 100%; margin-top: 16px">
      <el-table-column align="center" label="ID" prop="id" width="80" />
      <el-table-column align="center" label="优惠券名称" min-width="120" prop="name" />
      <el-table-column align="center" label="类型" prop="type" width="100" />
      <el-table-column align="center" label="优惠内容" min-width="120" prop="discount" />
      <el-table-column align="center" label="门槛金额" prop="minAmount" width="100" />
      <el-table-column align="center" label="最大优惠" prop="maxDiscount" width="100" />
      <el-table-column align="center" label="总数" prop="totalCount" width="80" />
      <el-table-column align="center" label="已用" prop="usedCount" width="80" />
      <el-table-column align="center" label="有效期" min-width="180">
        <template #default="{ row }">
          <span>{{ row.startTime }} ~ {{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : row.status === '停用' ? 'info' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="260">
        <template #default="{ row }">
          <el-button size="small" text type="primary" @click="openDialog('edit', row)">编辑</el-button>
          <el-button size="small" text type="danger" @click="deleteCoupon(row.id)">删除</el-button>
          <el-button size="small" text type="warning" @click="sendCoupon(row)">发放</el-button>
          <el-button size="small" text type="info" @click="openRecordDialog(row)">领取记录</el-button>
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
      :title="dialogMode === 'add' ? '添加优惠券' : '编辑优惠券'"
      width="500px"
      @update:model-value="(val) => (dialogVisible = val)"
    >
      <el-form ref="formRef" l label-width="100px" :model="form" :rules="rules">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="满减券" value="满减券" />
            <el-option label="折扣券" value="折扣券" />
            <el-option label="无门槛券" value="无门槛券" />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠内容" prop="discount">
          <el-input v-model="form.discount" placeholder="如：满100减10、9折、5元无门槛" />
        </el-form-item>
        <el-form-item label="门槛金额" prop="minAmount">
          <el-input v-model="form.minAmount" placeholder="0表示无门槛" />
        </el-form-item>
        <el-form-item label="最大优惠" prop="maxDiscount">
          <el-input v-model="form.maxDiscount" placeholder="最大优惠金额" />
        </el-form-item>
        <el-form-item label="总数" prop="totalCount">
          <el-input v-model="form.totalCount" placeholder="请输入总发放数量" />
        </el-form-item>
        <el-form-item label="有效期" required>
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
            <el-option label="启用" value="启用" />
            <el-option label="停用" value="停用" />
            <el-option label="已过期" value="已过期" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </vab-dialog>

    <!-- 领取记录弹窗 -->
    <vab-dialog
      :model-value="recordDialogVisible"
      title="领取记录"
      width="800px"
      @update:model-value="(val) => (recordDialogVisible = val)"
    >
      <el-table v-loading="recordLoading" border :data="recordList">
        <el-table-column align="center" label="ID" prop="id" width="80" />
        <el-table-column align="center" label="优惠券名称" min-width="120" prop="couponName" />
        <el-table-column align="center" label="券码" prop="couponCode" width="120" />
        <el-table-column align="center" label="用户" prop="userName" width="100" />
        <el-table-column align="center" label="手机号" prop="phone" width="120" />
        <el-table-column align="center" label="领取时间" min-width="160" prop="createTime" />
        <el-table-column align="center" label="使用时间" min-width="160" prop="useTime" />
        <el-table-column align="center" label="订单金额" prop="orderAmount" width="100" />
        <el-table-column align="center" label="优惠金额" prop="discountAmount" width="100" />
        <el-table-column align="center" label="状态" prop="status" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已使用' ? 'success' : row.status === '已过期' ? 'info' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <vab-pagination
        :current-page="recordQuery.pageNo"
        :page-size="recordQuery.pageSize"
        :total="recordTotal"
        @current-change="handleRecordCurrentChange"
        @size-change="handleRecordSizeChange"
      />
    </vab-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Refresh, Search } from '@element-plus/icons-vue'
import { doGoodsCouponDelete, doGoodsCouponEdit, doGoodsCouponSend, getGoodsCouponList, getGoodsCouponRecordList } from '/@/api/goodsCoupon'

interface Coupon {
  id?: string
  name: string
  code?: string
  type: string
  discount: string
  minAmount: string
  maxDiscount: string
  totalCount: string
  usedCount?: string
  startTime: string
  endTime: string
  status: string
  createTime?: string
}

const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  status: '',
})
const total = ref(0)
const couponList = ref<Coupon[]>([])
const loading = ref(false)

async function fetchList() {
  loading.value = true
  const { data } = await getGoodsCouponList(queryForm)
  couponList.value = data.list
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

const resetQueryForm = () => {
  ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
  })
  queryForm.pageNo = 1
  handleSearch()
}

// 弹窗表单
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = reactive<Coupon>({
  id: '',
  name: '',
  type: '',
  discount: '',
  minAmount: '',
  maxDiscount: '',
  totalCount: '',
  startTime: '',
  endTime: '',
  status: '启用',
})
const dateRange = ref<[string, string] | []>([])

const rules = {
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  discount: [{ required: true, message: '请输入优惠内容', trigger: 'blur' }],
  minAmount: [{ required: true, message: '请输入门槛金额', trigger: 'blur' }],
  maxDiscount: [{ required: true, message: '请输入最大优惠', trigger: 'blur' }],
  totalCount: [{ required: true, message: '请输入总数', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function openDialog(mode: 'add' | 'edit', row?: Coupon) {
  dialogMode.value = mode
  dialogVisible.value = true
  if (mode === 'edit' && row) {
    Object.assign(form, row)
    dateRange.value = [row.startTime, row.endTime]
  } else {
    Object.assign(form, {
      id: '',
      name: '',
      type: '',
      discount: '',
      minAmount: '',
      maxDiscount: '',
      totalCount: '',
      startTime: '',
      endTime: '',
      status: '启用',
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
    await doGoodsCouponEdit(form)
    $baseMessage(dialogMode.value === 'add' ? '添加成功' : '编辑成功', 'success', 'hey')
    dialogVisible.value = false
    fetchList()
  })
}

async function deleteCoupon(id: string) {
  await doGoodsCouponDelete({ id })
  $baseMessage('删除成功', 'success', 'hey')
  // 删除后如果当前页没数据自动跳到上一页
  if (couponList.value.length === 1 && queryForm.pageNo > 1) {
    queryForm.pageNo--
  } else {
    fetchList()
  }
}

async function sendCoupon(row: Coupon) {
  await doGoodsCouponSend({ id: row.id })
  $baseMessage('发放成功', 'success', 'hey')
}

// 领取记录
const recordDialogVisible = ref(false)
const recordList = ref<any[]>([])
const recordLoading = ref(false)
const recordTotal = ref(0)
const recordQuery = reactive({
  pageNo: 1,
  pageSize: 10,
  couponName: '',
})

function openRecordDialog(row: Coupon) {
  recordDialogVisible.value = true
  recordQuery.couponName = row.name
  recordQuery.pageNo = 1
  fetchRecordList()
}

async function fetchRecordList() {
  recordLoading.value = true
  const { data } = await getGoodsCouponRecordList(recordQuery)
  recordList.value = data.list
  recordTotal.value = data.total
  recordLoading.value = false
}

function handleRecordSizeChange(val: number) {
  recordQuery.pageNo = 1
  recordQuery.pageSize = val
  fetchRecordList()
}

function handleRecordCurrentChange(val: number) {
  recordQuery.pageNo = val
  fetchRecordList()
}
</script>

<style scoped>
.goods-coupon-container {
  padding: 24px;
}
</style>
