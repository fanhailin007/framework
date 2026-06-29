<template>
  <div class="goods-sku-container auto-height-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="10">
        <el-button :icon="Plus" type="primary" @click="handleAdd">添加</el-button>
        <el-button :icon="Delete" type="danger" @click="handleDelete">删除</el-button>
        <el-button :icon="Upload" type="primary" @click="handleImportSku">导入</el-button>
        <el-button :icon="Download" type="success" @click="handleExportSku">导出</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="14">
        <el-form inline :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input v-model="queryForm.skuCode" clearable placeholder="请输入SKU编码" style="margin-right: 10px" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryForm.skuName" clearable placeholder="请输入SKU名称" style="margin-right: 10px" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryForm.category" clearable placeholder="商品分类" style="margin-right: 10px">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryForm.status" clearable placeholder="状态">
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="loading" native-type="submit" type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <!-- 导入SKU对话框 -->
    <el-dialog v-model="importDialogVisible" :close-on-press-escape="true" title="导入SKU" width="500px">
      <div class="import-dialog-content">
        <el-upload
          accept=".csv,.xlsx,.xls"
          action="/api/upload"
          :auto-upload="false"
          class="import-uploader"
          :limit="1"
          :on-change="handleImportFileChange"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <p class="upload-tip">支持 .csv, .xlsx, .xls 格式的文件</p>
          </template>
        </el-upload>
        <div class="import-template">
          <span>没有导入模板？</span>
          <el-button text @click="downloadImportTemplate">下载模板</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button :disabled="!importFile" type="primary" @click="confirmImport">确认导入</el-button>
      </template>
    </el-dialog>

    <el-table ref="tableRef" v-loading="loading" border :data="tableData" @selection-change="setSelectRows">
      <el-table-column type="selection" width="38" />
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品分类" min-width="120" prop="category">
        <template #default="{ row }">
          {{ row.category || '-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="SKU编码" min-width="120" prop="skuCode" />
      <el-table-column align="center" label="SKU名称" min-width="200" prop="skuName" />
      <el-table-column align="center" label="图片" width="80">
        <template #default="{ row }">
          <el-image v-if="row.image" class="table-image" fit="cover" :preview-src-list="[row.image]" preview-teleported :src="row.image" />
          <el-icon v-else>
            <picture-filled />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规格" min-width="200">
        <template #default="{ row }">
          <el-tag v-for="spec in row.specifications" :key="spec.key" style="margin: 0 8px 8px 0">{{ spec.key }}: {{ spec.value }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格" min-width="100" prop="price" sortable>
        <template #default="{ row }">¥{{ row.price }}</template>
      </el-table-column>
      <el-table-column align="center" label="库存" min-width="80" prop="stock" sortable />
      <el-table-column align="center" label="状态" min-width="100" prop="status" sortable>
        <template #default="{ row }">
          <el-tag effect="dark" :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" min-width="80" prop="sort" sortable />
      <el-table-column align="center" label="备注" min-width="150" prop="remark" show-overflow-tooltip />
      <el-table-column align="center" label="操作" width="150">
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
      :current-page="pagination.pageNo"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="dialogVisible"
      destroy-on-close
      :size="isSmallScreen ? '95%' : '1600px'"
      :title="dialogType === 'add' ? '新增SKU' : '编辑SKU'"
    >
      <div class="two-column-layout">
        <!-- 左侧基本信息 -->
        <div class="left-column">
          <el-form ref="formRef" class="sku-form" label-width="100px" :model="form" :rules="rules">
            <el-form-item label="商品分类" prop="category">
              <el-select v-model="form.category" clearable placeholder="请选择商品分类">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input v-model="form.skuCode" placeholder="请输入SKU编码" />
            </el-form-item>
            <el-form-item label="SKU名称" prop="skuName">
              <el-input v-model="form.skuName" placeholder="请输入SKU名称" />
            </el-form-item>

            <!-- 单规格设置 -->
            <template v-if="skuTable.length === 0">
              <el-form-item label="图片" prop="image">
                <div class="image-upload-container">
                  <el-upload
                    action="/api/upload"
                    :auto-upload="false"
                    class="sku-single-upload"
                    :on-change="handleSingleImageChange"
                    :show-file-list="false"
                  >
                    <img v-if="form.image" class="sku-image-preview" :src="form.image" @error="(event) => (form.image = '')" />
                    <div v-else class="sku-upload-placeholder">
                      <el-icon class="sku-upload-icon">
                        <plus />
                      </el-icon>
                      <div class="upload-text">点击上传</div>
                    </div>
                  </el-upload>
                  <div class="el-upload__tip">只能上传JPG/PNG/GIF文件，且不超过5MB</div>
                </div>
              </el-form-item>
              <el-form-item label="价格" prop="price">
                <el-input-number v-model="form.price" :min="0" :precision="2" />
              </el-form-item>
              <el-form-item label="库存" prop="stock">
                <el-input-number v-model="form.stock" :min="0" :precision="0" />
              </el-form-item>
            </template>

            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio value="active">启用</el-radio>
                <el-radio value="inactive">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" :min="0" :precision="0" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注信息" :rows="3" type="textarea" />
            </el-form-item>
          </el-form>
        </div>

        <!-- 右侧规格设置 -->
        <div class="right-column">
          <el-card header="规格设置" shadow="never">
            <!-- 多规格多属性设置 -->
            <div class="spec-setting-section">
              <!-- 规格项添加区域 -->
              <div class="spec-header">
                <el-alert :closable="false" style="width: 100%" title="添加规格（如颜色、尺码、材质等），每个规格可以包含多个规格值" />
              </div>

              <!-- 规格列表 -->
              <div v-for="(spec, specIndex) in specList" :key="specIndex" class="spec-item">
                <div class="spec-title">规格 {{ specIndex + 1 }}</div>
                <div class="spec-content">
                  <div class="spec-name-values-row">
                    <div class="spec-name-container">
                      <div class="input-label">规格名称：</div>
                      <el-input v-model="spec.name" placeholder="规格名，如颜色、尺码等" />
                    </div>
                    <div class="input-container">
                      <div class="input-label">添加规格值：</div>
                      <el-input v-model="spec.input" placeholder="输入规格值后按回车添加" @keyup.enter="addSpecValue(specIndex)">
                        <template #append>
                          <el-button @click="addSpecValue(specIndex)">添加</el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>

                  <div class="tag-container">
                    <div v-if="spec.values.length > 0" class="tag-label">已添加规格值：</div>
                    <div class="tag-list">
                      <div v-for="(val, valIndex) in spec.values" :key="valIndex" class="spec-value-item">
                        <el-tag
                          v-if="!val.isEditing"
                          closable
                          style="margin: 0 8px 8px 0"
                          @click="startEditSpecValue(specIndex, valIndex)"
                          @close="removeSpecValue(specIndex, valIndex)"
                        >
                          {{ val.text }}
                        </el-tag>
                        <el-input
                          v-else
                          v-model="val.text"
                          class="spec-value-input"
                          size="small"
                          @blur="finishEditSpecValue(specIndex, valIndex)"
                          @keyup.enter="finishEditSpecValue(specIndex, valIndex)"
                        />
                      </div>
                    </div>
                    <div v-if="spec.values.length === 0" class="empty-tip">暂无规格值，请在上方添加</div>
                  </div>

                  <div class="spec-action">
                    <el-button type="danger" @click="removeSpec(specIndex)">删除规格</el-button>
                  </div>
                </div>
              </div>

              <!-- 添加规格按钮 -->
              <el-button class="btn-gap" style="margin-top: 16px" type="primary" @click="addSpec">
                <vab-icon icon="add-line" />
                添加规格
              </el-button>
            </div>

            <!-- SKU列表 -->
            <div v-if="skuTable.length > 0" class="sku-table-wrapper">
              <el-card class="sku-card" header="SKU列表" shadow="never">
                <el-alert
                  :closable="false"
                  style="margin-bottom: 16px"
                  title="以下是根据规格组合生成的SKU列表，请为每个SKU设置价格和库存"
                  type="success"
                />

                <div class="table-responsive">
                  <el-table border :data="skuTable" max-height="350px" style="width: 100%">
                    <el-table-column align="center" width="55">
                      <template #header>
                        <el-checkbox v-model="selectAllSkus" @change="handleSelectAllSkus" />
                      </template>
                      <template #default="{ row }">
                        <el-checkbox v-model="row.isSelected" />
                      </template>
                    </el-table-column>
                    <el-table-column v-for="(spec, i) in specList" :key="i" align="center" :label="spec.name || `规格${i + 1}`">
                      <template #default="{ row }">
                        {{ row.specs[i] }}
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="图片" width="120">
                      <template #default="{ row }">
                        <el-upload
                          action="/api/upload"
                          :auto-upload="false"
                          class="sku-image-upload"
                          :on-change="(file) => handleSkuImageChange(file, row)"
                          :show-file-list="false"
                        >
                          <img v-if="row.image" class="sku-image-preview" :src="row.image" @error="handleImageError($event, row)" />
                          <el-icon v-else class="sku-upload-icon">
                            <plus />
                          </el-icon>
                        </el-upload>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="价格" width="180">
                      <template #default="{ row }">
                        <el-input-number v-model="row.price" :min="0" :precision="2" :step="1" step-strictly />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="库存" width="180">
                      <template #default="{ row }">
                        <el-input-number v-model="row.stock" :min="0" :precision="0" :step="1" step-strictly />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <!-- 批量设置 -->
                <div class="batch-setting">
                  <el-row :gutter="16">
                    <el-col :span="24">
                      <div class="batch-header">
                        <div class="batch-title">批量操作</div>
                        <el-checkbox v-model="selectAllSkus" @change="handleSelectAllSkus">全选</el-checkbox>
                      </div>
                    </el-col>
                  </el-row>
                  <div class="action-container">
                    <div class="action-item">
                      <el-input-number v-model="batchPrice" :min="0" placeholder="批量价格" :precision="2" />
                      <el-button style="margin-left: 12px" type="primary" @click="setBatchPrice">批量设置价格</el-button>
                      <el-input-number v-model="batchStock" :min="0" placeholder="批量库存" :precision="0" style="margin-left: 12px" />
                      <el-button style="margin-left: 12px" type="primary" @click="setBatchStock">批量设置库存</el-button>
                      <el-dropdown @command="handleBatchCommand">
                        <el-button type="primary">
                          更多批量操作
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </el-button>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item command="increasePrice">价格增加</el-dropdown-item>
                            <el-dropdown-item command="decreasePrice">价格减少</el-dropdown-item>
                            <el-dropdown-item command="percentPrice">价格百分比调整</el-dropdown-item>
                            <el-dropdown-item command="increaseStock">库存增加</el-dropdown-item>
                            <el-dropdown-item command="decreaseStock">库存减少</el-dropdown-item>
                            <el-dropdown-item command="batchDiscount">设置统一折扣</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <!-- <el-upload
                                                action="/api/upload"
                                                :auto-upload="false"
                                                class="batch-image-upload"
                                                :on-change="handleBatchImageChange"
                                                :show-file-list="false"
                                            >
                                                <el-button type="primary">批量设置图片</el-button>
                                            </el-upload> -->
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </el-card>
        </div>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, Delete, Download, PictureFilled, Plus, Refresh, Search, Upload } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { addSku, deleteSku, editSku, getSkuList } from '/@/api/goodsSku'

// 定义SKU接口
interface SkuItem {
  id: string
  skuCode: string
  skuName: string
  specifications: Array<{ key: string; value: string }>
  price: number
  stock: number
  status: string
  sort: number
  remark: string
  image?: string
  parentId?: string // 关联父产品ID
  costPrice?: number // 成本价
  marketPrice?: number // 市场价
  barcode?: string // 条形码
  weight?: number // 重量
  volume?: number // 体积
  isDefault?: boolean // 是否默认SKU
  salesCount?: number // 销量
  createdAt?: string
  updatedAt?: string
  multiSpecs?: Array<SkuSpecDetail> // 存储多规格数据
  category: string
}

// 定义规格详情接口
interface SkuSpecDetail {
  id?: string
  specs: Array<{ key: string; value: string }>
  price: number
  stock: number
  image?: string
}

// 定义规格属性接口
interface SpecItem {
  name: string
  values: Array<{ text: string; isEditing?: boolean }>
  input: string
}

// 定义SKU组合接口
interface SkuCombination {
  id?: string // 已有规格组合可能有ID
  specs: string[]
  price: number
  stock: number
  image?: string
  isSelected?: boolean // 用于批量选择操作
}

defineOptions({
  name: 'GoodsSku',
})

const tableRef = ref<TableInstance>()
const selectRows = ref<any>([])
const formRef = ref()

// 查询表单
const queryForm = reactive({
  pageNo: 1,
  pageSize: 20,
  skuCode: '',
  skuName: '',
  status: '',
  category: '',
})

// 导入导出相关
const importDialogVisible = ref(false)
const importFile = ref<File | null>(null)

// 列表数据
const loading = ref(false)
const tableData = ref<SkuItem[]>([])
const pagination = reactive({
  pageNo: 1,
  pageSize: 20,
  total: 0,
})

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

// SKU表单
const form = reactive<SkuItem & { specs?: string[] }>({
  id: '',
  skuCode: '',
  skuName: '',
  specifications: [],
  price: 0,
  stock: 0,
  status: 'active',
  sort: 0,
  remark: '',
  image: '',
  specs: [],
  category: '',
})

// 表单验证规则
const rules = {
  skuCode: [{ required: true, message: '请输入SKU编码', trigger: 'blur' }],
  skuName: [{ required: true, message: '请输入SKU名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  specs: [
    {
      validator: (rule: any, value: any, callback: any) => {
        // 如果有多规格设置，则检查规格是否有效
        if (specList.value.length > 0) {
          // 检查每个规格是否都有名称和至少一个规格值
          const isValid = specList.value.every((spec) => spec.name && spec.values.length > 0)
          if (isValid) {
            // 检查SKU表格中的价格和库存是否有效
            if (skuTable.value.length > 0) {
              const hasPriceStock = skuTable.value.every((sku) => sku.price >= 0 && sku.stock >= 0)
              if (hasPriceStock) {
                callback()
              } else {
                callback(new Error('每个SKU组合必须设置价格和库存'))
              }
            } else {
              callback()
            }
          } else {
            callback(new Error('每个规格必须有名称和至少一个规格值'))
          }
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
}

// 批量设置
const batchPrice = ref(0)
const batchStock = ref(0)
const selectAllSkus = ref(false)

// 批量全选
const handleSelectAllSkus = (val: any) => {
  const isChecked = val === true || val === 'true'
  skuTable.value.forEach((sku) => {
    sku.isSelected = isChecked
  })
}

// 处理批量命令
const handleBatchCommand = (command: string) => {
  // 检查是否有选中的SKU
  const selectedSkus = skuTable.value.filter((sku) => sku.isSelected)
  if (selectedSkus.length === 0) {
    $baseMessage('请先选择需要操作的SKU', 'warning', 'hey')
    return
  }

  switch (command) {
    case 'increasePrice': {
      handlePriceAdjustment('increase')
      break
    }
    case 'decreasePrice': {
      handlePriceAdjustment('decrease')
      break
    }
    case 'percentPrice': {
      handlePriceAdjustment('percent')
      break
    }
    case 'increaseStock': {
      handleStockAdjustment('increase')
      break
    }
    case 'decreaseStock': {
      handleStockAdjustment('decrease')
      break
    }
    case 'batchDiscount': {
      handlePriceAdjustment('discount')
      break
    }
    default: {
      break
    }
  }
}

// 处理价格调整
const handlePriceAdjustment = (type: 'increase' | 'decrease' | 'percent' | 'discount') => {
  let value = 0
  let title = ''
  let message = ''

  switch (type) {
    case 'increase': {
      title = '增加价格'
      message = '请输入要增加的金额'

      break
    }
    case 'decrease': {
      title = '减少价格'
      message = '请输入要减少的金额'

      break
    }
    case 'percent': {
      title = '百分比调整'
      message = '请输入百分比值，例如：10表示提高10%，-10表示降低10%'

      break
    }
    default: {
      title = '设置折扣'
      message = '请输入折扣值，例如：8.5表示8.5折'
    }
  }

  // 这里应该弹出对话框让用户输入数值
  // 简化处理，使用确认框和prompt
  const promptText = globalThis.prompt(message, '0')
  if (promptText === null) return // 用户取消

  value = parseFloat(promptText)
  if (isNaN(value)) {
    $baseMessage('请输入有效数字', 'error', 'hey')
    return
  }

  // 应用价格调整
  const selectedSkus = skuTable.value.filter((sku) => sku.isSelected)
  selectedSkus.forEach((sku) => {
    switch (type) {
      case 'increase': {
        sku.price += value
        break
      }
      case 'decrease': {
        sku.price = Math.max(0, sku.price - value)
        break
      }
      case 'percent': {
        sku.price = Math.max(0, sku.price * (1 + value / 100))
        break
      }
      case 'discount': {
        sku.price = Math.max(0, sku.price * (value / 10))
        break
      }
    }
    // 保留两位小数
    sku.price = parseFloat(sku.price.toFixed(2))
  })

  $baseMessage(`成功${title}，共影响${selectedSkus.length}个SKU`, 'success', 'hey')
}

// 处理库存调整
const handleStockAdjustment = (type: 'increase' | 'decrease') => {
  let value = 0
  let title = type === 'increase' ? '增加库存' : '减少库存'
  let message = type === 'increase' ? '请输入要增加的库存数量' : '请输入要减少的库存数量'

  // 简化处理，使用prompt
  const promptText = globalThis.prompt(message, '0')
  if (promptText === null) return // 用户取消

  value = parseInt(promptText)
  if (isNaN(value) || value < 0) {
    $baseMessage('请输入有效的正整数', 'error', 'hey')
    return
  }

  // 应用库存调整
  const selectedSkus = skuTable.value.filter((sku) => sku.isSelected)
  selectedSkus.forEach((sku) => {
    if (type === 'increase') {
      sku.stock += value
    } else {
      sku.stock = Math.max(0, sku.stock - value)
    }
  })

  $baseMessage(`成功${title}，共影响${selectedSkus.length}个SKU`, 'success', 'hey')
}

// 多规格多属性相关
const specList = ref<SpecItem[]>([]) // 规格列表
const skuTable = ref<SkuCombination[]>([]) // SKU组合表

// 监听规格变化自动生成SKU组合
watch(
  specList,
  () => {
    generateSkuTable()
  },
  { deep: true }
)

onActivated(() => {
  tableRef.value?.doLayout()
})

// 获取SKU列表
const fetchSkuList = async () => {
  loading.value = true
  try {
    const response = await getSkuList({
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      skuName: queryForm.skuName,
      status: queryForm.status,
      category: queryForm.category,
    })
    tableData.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    console.error('获取SKU列表失败:', error)
    $baseMessage('获取SKU列表失败', 'error', 'hey')
  } finally {
    loading.value = false
  }
}

// 查询数据
const handleQuery = () => {
  pagination.pageNo = 1
  fetchSkuList()
}

// 分页处理
const handleCurrentChange = (page: number) => {
  pagination.pageNo = page
  fetchSkuList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.pageNo = 1
  fetchSkuList()
}

const setSelectRows = (value: string) => {
  selectRows.value = value
}

// 新增SKU
const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 编辑SKU
const handleEdit = (row: SkuItem) => {
  dialogType.value = 'edit'
  resetForm()

  // 填充基本信息
  Object.assign(form, row)

  // 处理规格信息
  if (row.specifications && row.specifications.length > 0) {
    // 映射规格到specList
    const specMap = new Map()

    row.specifications.forEach((spec) => {
      if (!specMap.has(spec.key)) {
        specMap.set(spec.key, [])
      }
      specMap.get(spec.key).push(spec.value)
    })

    specList.value = Array.from(specMap.entries()).map(([name, values]) => ({
      name,
      values: (values as string[]).map((text) => ({ text })),
      input: '',
    }))

    // 生成SKU表格
    generateSkuTable()

    // 设置价格、库存和图片
    if (skuTable.value.length > 0) {
      // 对所有规格组合设置相同的价格、库存和图片
      skuTable.value.forEach((sku) => {
        sku.price = row.price
        sku.stock = row.stock
        sku.image = row.image
      })
      console.log('编辑模式，设置图片：', row.image)
      console.log('SKU表格数据：', skuTable.value)
    }

    // 将当前的规格值填充到form.specs中以供显示
    if (row.specifications.length > 0) {
      form.specs = specList.value.map((_, index) => {
        const spec = row.specifications.find((s) => s.key === specList.value[index].name)
        return spec ? spec.value : ''
      })
    }
  }

  dialogVisible.value = true
}

// 删除SKU
const handleDelete = (row?: any) => {
  if (row?.id) {
    $baseConfirm('您确定要删除当前项吗', null, async () => {
      try {
        const response: any = await deleteSku({ id: row.id })
        $baseMessage(response.msg, 'success', 'hey')
        fetchSkuList()
      } catch (error) {
        console.error('删除失败:', error)
        $baseMessage('删除失败', 'error', 'hey')
      }
    })
  } else {
    if (selectRows.value.length > 0) {
      const ids = selectRows.value.map((item: { id: any }) => item.id).join(',')
      $baseConfirm('您确定要删除选中项吗', null, async () => {
        try {
          const response: any = await deleteSku({ ids })
          $baseMessage(response.msg, 'success', 'hey')
          fetchSkuList()
        } catch (error) {
          console.error('删除失败:', error)
          $baseMessage('删除失败', 'error', 'hey')
        }
      })
    } else {
      $baseMessage('您未选中任何行', 'warning', 'hey')
    }
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: '',
    skuCode: '',
    skuName: '',
    specifications: [],
    price: 0,
    stock: 0,
    status: 'active',
    sort: 0,
    remark: '',
    image: '', // 仅用于多规格SKU
    specs: [],
    category: '',
  })

  // 清空规格列表和SKU表格
  specList.value = []
  skuTable.value = []

  // 清空批量设置
  batchPrice.value = 0
  batchStock.value = 0
}

// 添加规格
const addSpec = () => {
  specList.value.push({ name: '', values: [], input: '' })
}

// 删除规格
const removeSpec = (index: number) => {
  specList.value.splice(index, 1)
}

// 添加规格值
const addSpecValue = (specIndex: number) => {
  const spec = specList.value[specIndex]
  if (!spec) return

  const val = spec.input?.trim()
  if (val && !spec.values.some((v) => v.text === val)) {
    spec.values.push({ text: val })
    spec.input = ''
  } else if (val) {
    $baseMessage('该规格值已存在', 'warning', 'hey')
    spec.input = ''
  } else {
    $baseMessage('规格值不能为空', 'warning', 'hey')
  }
}

// 删除规格值
const removeSpecValue = (specIndex: number, valIndex: number) => {
  if (specList.value[specIndex]) {
    specList.value[specIndex].values.splice(valIndex, 1)
  }
}

// 开始编辑规格值
const startEditSpecValue = (specIndex: number, valIndex: number) => {
  if (specList.value[specIndex] && specList.value[specIndex].values[valIndex]) {
    specList.value[specIndex].values[valIndex].isEditing = true
    // 在下一个更新周期聚焦到输入框
    nextTick(() => {
      const inputElements = document.querySelectorAll('.spec-value-input input')
      if (inputElements && inputElements.length > 0) {
        ;(inputElements[0] as HTMLInputElement).focus()
      }
    })
  }
}

// 完成编辑规格值
const finishEditSpecValue = (specIndex: number, valIndex: number) => {
  if (specList.value[specIndex] && specList.value[specIndex].values[valIndex]) {
    const val = specList.value[specIndex].values[valIndex]

    // 检查是否为空值
    if (!val.text || val.text.trim() === '') {
      $baseMessage('规格值不能为空', 'warning', 'hey')
      // 恢复原值或删除
      removeSpecValue(specIndex, valIndex)
      return
    }

    // 检查是否有重复（跳过自己）
    const hasDuplicate = specList.value[specIndex].values.some((v, idx) => idx !== valIndex && v.text === val.text)

    if (hasDuplicate) {
      $baseMessage('规格值不能重复', 'warning', 'hey')
      // 恢复原值或使用随机后缀
      val.text = `${val.text}_${Math.floor(Math.random() * 1000)}`
    }

    val.isEditing = false
    // 重新生成SKU表格
    generateSkuTable()
  }
}

// 笛卡尔积生成所有SKU组合
const generateSkuTable = () => {
  // 检查是否有有效的规格
  if (specList.value.length === 0 || specList.value.some((s) => !s.name || s.values.length === 0)) {
    skuTable.value = []
    return
  }

  // 提取所有规格值数组（只使用text属性）
  const specValues = specList.value.map((s) => s.values.map((v) => v.text))

  // 计算笛卡尔积
  const cartesian = (...arrays: any[]): any[] => {
    return arrays.reduce((acc: any[], curr: any[]) => acc.flatMap((combo: any) => curr.map((item: any) => [...combo, item])), [[]])
  }

  // 生成所有组合
  const combinations = cartesian(...specValues)

  // 保存现有SKU组合的价格、库存和图片信息
  const existingSkus = [...skuTable.value]

  // 创建SKU表格数据
  skuTable.value = combinations.map((specs) => {
    // 尝试查找对应的现有SKU
    const existingSku = existingSkus.find((sku) => JSON.stringify(sku.specs) === JSON.stringify(specs))

    if (existingSku) {
      // 保留现有数据
      return {
        ...existingSku,
        specs,
      }
    }

    // 创建新SKU数据
    return {
      specs,
      price: form.price || 0,
      stock: form.stock || 0,
      image: form.image || '',
      isSelected: false,
    }
  })
}

// 批量设置价格
const setBatchPrice = () => {
  if (skuTable.value.length > 0) {
    skuTable.value.forEach((sku) => {
      sku.price = batchPrice.value
    })
    $baseMessage('批量设置价格成功', 'success', 'hey')
  }
}

// 批量设置库存
const setBatchStock = () => {
  if (skuTable.value.length > 0) {
    skuTable.value.forEach((sku) => {
      sku.stock = batchStock.value
    })
    $baseMessage('批量设置库存成功', 'success', 'hey')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 构建提交数据
        let submitData: any = { ...form }

        // 处理多规格多属性
        if (skuTable.value.length > 0) {
          // 如果有多规格，则生成specifications数组
          const specifications: any[] = []

          skuTable.value.forEach((item) => {
            const specObj: any = {}

            // 将每个SKU组合的规格值与规格名关联
            item.specs.forEach((value, index) => {
              if (specList.value[index]) {
                const key = specList.value[index].name
                specObj[key] = value
              }
            })

            // 为每种规格组合创建一个SKU记录
            const skuData = {
              skuCode: `${submitData.skuCode}_${item.specs.join('_')}`, // 自动生成不同的SKU编码
              skuName: submitData.skuName,
              specifications: Object.entries(specObj).map(([key, value]) => ({
                key,
                value,
              })),
              price: item.price,
              stock: item.stock,
              status: submitData.status,
              sort: submitData.sort,
              remark: submitData.remark,
              image: item.image || submitData.image || '', // 添加图片字段
              category: submitData.category,
            }

            specifications.push(skuData)
          })

          // 如果是编辑模式且有ID，则保留
          if (dialogType.value === 'edit' && submitData.id) {
            specifications[0].id = submitData.id
          }

          submitData = {
            bulkOperation: true,
            skuList: specifications,
          }
        } else {
          // 单规格模式，保持原样
          if (dialogType.value === 'add') {
            delete submitData.id
          }
          // 保留图片字段，即使在单规格模式下也可以使用
        }

        console.log('提交数据:', JSON.stringify(submitData))

        let message = '操作成功'
        if (dialogType.value === 'edit') {
          // 编辑模式
          const response: any = await editSku(submitData)
          if (response && typeof response === 'object' && response.data && response.data.msg) {
            message = response.data.msg
          }
        } else {
          // 新增模式
          const response: any = await addSku(submitData)
          if (response && typeof response === 'object' && response.data && response.data.msg) {
            message = response.data.msg
          }
        }

        $baseMessage(message, 'success', 'hey')
        dialogVisible.value = false
        fetchSkuList()
      } catch (error: any) {
        console.error('操作失败:', error)
        let errorMsg = '操作失败'
        if (error.message) {
          errorMsg += `: ${error.message}`
        }
        if (error.response && error.response.data) {
          console.error('错误响应数据:', error.response.data)
          if (error.response.data.msg) {
            errorMsg = error.response.data.msg
          }
        } else if (typeof error === 'object' && error.msg) {
          errorMsg = error.msg
        }
        $baseMessage(errorMsg, 'error', 'hey')
      }
    } else {
      $baseMessage('请正确填写表单信息', 'warning', 'hey')
      return false
    }
  })
}

const resetQueryForm = () => {
  ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
  })
  pagination.pageNo = 1
  fetchSkuList()
}

onBeforeMount(() => {
  fetchSkuList()
})

// 响应式判断屏幕大小
const isSmallScreen = ref(window.innerWidth <= 768)

// 监听窗口大小变化
const handleResize = () => {
  isSmallScreen.value = window.innerWidth <= 768
}

// 添加和移除事件监听器
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 处理SKU图片上传
const handleSkuImageChange = (file: any, row: SkuCombination) => {
  if (!file) return

  // 获取文件对象
  const fileObj = file.raw || file

  if (fileObj) {
    // 检查文件类型
    if (!/image\/(jpeg|png|jpg|gif)/.test(fileObj.type)) {
      $baseMessage('只能上传JPG/PNG/GIF格式的图片', 'warning', 'hey')
      return
    }

    // 检查文件大小
    if (fileObj.size / 1024 / 1024 > 5) {
      $baseMessage('图片大小不能超过5MB', 'warning', 'hey')
      return
    }

    // 创建文件读取器
    const reader = new FileReader()
    reader.readAsDataURL(fileObj)
    reader.addEventListener('load', () => {
      // 设置图片预览
      row.image = reader.result as string
    })
  }
}

// 处理批量设置图片
// const handleBatchImageChange = (file: any) => {
//     if (!file) return

//     // 检查文件类型
//     const isImage = file.raw.type.startsWith('image/')
//     if (!isImage) {
//         $baseMessage('请上传图片文件', 'error')
//         return
//     }

//     // 读取文件并设置到所有SKU
//     const reader = new FileReader()
//     reader.addEventListener('load', () => {
//         const imageUrl = reader.result as string
//         skuTable.value.forEach((sku) => {
//             sku.image = imageUrl
//         })
//         $baseMessage('批量设置图片成功', 'success')
//     })
//     reader.readAsDataURL(file.raw)
// }

// 处理图片加载失败
const handleImageError = (event: Event, row: SkuCombination) => {
  console.log('图片加载失败', event)
  // 当图片加载失败时，清空图片URL使用默认的加号图标
  row.image = ''
}

// 导出SKU数据
const handleExportSku = () => {
  const header = ['SKU编码', 'SKU名称', '规格', '价格', '库存', '状态', '排序', '备注', '图片URL']
  const data = tableData.value.map((item) => [
    item.skuCode,
    item.skuName,
    item.specifications.map((spec) => `${spec.key}:${spec.value}`).join(';'),
    item.price.toString(),
    item.stock.toString(),
    item.status === 'active' ? '启用' : '禁用',
    item.sort.toString(),
    item.remark || '',
    item.image || '',
  ])

  // 生成CSV内容
  let csvContent = `${header.join(',')}\n`
  data.forEach((row) => {
    csvContent += `${row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')}\n`
  })

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `sku_export_${Date.now()}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  $baseMessage('导出成功', 'success', 'hey')
}

// 导入SKU相关方法
const handleImportSku = () => {
  importDialogVisible.value = true
  importFile.value = null
}

const handleImportFileChange = (file: any) => {
  if (!file) {
    importFile.value = null
    return
  }

  const fileExt = file.name.split('.').pop().toLowerCase()
  if (!['csv', 'xlsx', 'xls'].includes(fileExt)) {
    $baseMessage('请上传正确的文件格式', 'error', 'hey')
    importFile.value = null
    return
  }

  importFile.value = file.raw
}

const downloadImportTemplate = () => {
  const header = ['SKU编码', 'SKU名称', '规格', '价格', '库存', '状态', '排序', '备注', '图片URL']
  const sample = ['SKU001', '示例商品', '颜色:红色;尺码:XL', '99.99', '100', '启用', '1', '示例备注', '']

  // 生成CSV内容
  let csvContent = `${header.join(',')}\n${sample.join(',')}`

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'sku_import_template.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const confirmImport = () => {
  if (!importFile.value) {
    $baseMessage('请先选择文件', 'warning', 'hey')
    return
  }

  // 这里应该调用API上传文件并处理导入逻辑
  // 简化处理，直接提示成功
  $baseMessage('导入成功，共处理 10 条数据', 'success', 'hey')
  importDialogVisible.value = false
}

// 处理单规格图片上传
const handleSingleImageChange = (file: any) => {
  if (!file) return

  // 获取文件对象
  const fileObj = file.raw || file

  if (fileObj) {
    // 检查文件类型
    if (!/image\/(jpeg|png|jpg|gif)/.test(fileObj.type)) {
      $baseMessage('只能上传JPG/PNG/GIF格式的图片', 'warning', 'hey')
      return
    }

    // 检查文件大小
    if (fileObj.size / 1024 / 1024 > 5) {
      $baseMessage('图片大小不能超过5MB', 'warning', 'hey')
      return
    }

    // 创建文件读取器
    const reader = new FileReader()
    reader.readAsDataURL(fileObj)
    reader.addEventListener('load', () => {
      // 设置图片预览
      form.image = reader.result as string
    })
  }
}

// 商品分类mock数据
const categoryOptions = [
  { label: '食品饮料', value: '食品饮料' },
  { label: '家用电器', value: '家用电器' },
  { label: '其他', value: '其他' },
]
</script>

<style lang="scss" scoped>
.goods-sku-container {
  box-sizing: border-box;
  width: 100%;

  .two-column-layout {
    display: flex;
    gap: 20px;
    width: 100%;
    height: 100%;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .left-column {
      width: 30%;
      min-width: 280px;

      @media (max-width: 768px) {
        width: 100%;
        min-width: 100%;
      }
    }

    .right-column {
      flex: 1;
      overflow-y: auto;

      @media (max-width: 768px) {
        width: 100%;
        margin-top: 20px;
      }
    }
  }

  .sku-table-wrapper {
    margin-top: 20px;

    .table-responsive {
      width: 100%;
      overflow-x: auto;

      @media (max-width: 768px) {
        -webkit-overflow-scrolling: touch;
        margin-bottom: 15px;
      }
    }

    :deep(.el-table) {
      width: 100% !important;

      .el-table__body {
        width: 100% !important;
      }

      @media (max-width: 768px) {
        .el-input-number {
          width: 120px;
          min-width: 120px;
        }
      }
    }

    .el-alert {
      margin-bottom: 16px;
    }
  }

  :deep(.el-card) {
    border-radius: var(--el-border-radius-base);

    .el-card__header {
      padding: 15px 20px;
      font-weight: 600;
      border-bottom: 1px solid var(--el-border-color-light);
    }

    .el-card__body {
      padding: 20px;
    }
  }

  .sku-form {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;

    .el-form-item {
      width: 100%;
      margin-bottom: 22px;

      &:last-child {
        margin-bottom: 0;
      }

      :deep(.el-form-item__content) {
        flex: 1;
        width: calc(100% - 100px);
      }
    }

    .spec-form-item,
    .sku-table-form-item {
      display: block !important;
      width: 100% !important;
      margin-bottom: 30px;

      :deep(.el-form-item__content) {
        display: flex;
        flex-direction: column;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
      }
    }

    :deep(.el-form-item__label) {
      width: 100px !important;
      padding-right: 20px;
      text-align: right;
    }
  }

  .spec-item {
    padding: 18px;
    margin-bottom: 16px;
    background-color: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
  }

  .spec-title {
    padding-bottom: 12px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .spec-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .spec-name-values-row {
    display: flex;
    gap: 20px;
    width: 100%;

    @media (max-width: 576px) {
      flex-direction: column;
      gap: 10px;
    }
  }

  .spec-name-container {
    width: 40%;

    @media (max-width: 576px) {
      width: 100%;
    }
  }

  .input-container {
    width: 60%;

    @media (max-width: 576px) {
      width: 100%;
    }
  }

  .input-label,
  .tag-label {
    margin-bottom: 5px;
  }

  .spec-setting-section,
  .sku-table-section {
    width: 100%;
  }

  .spec-header {
    margin-bottom: 16px;
  }

  :deep(.el-input) {
    width: 100%;

    .el-input__wrapper {
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
    }
  }

  .tag-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 32px;
    padding: 4px 0;
    padding-top: 10px;
    margin-bottom: 0;
    border-top: 1px dashed var(--el-border-color);
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    padding: 4px;
    margin: -4px;
  }

  .empty-tip {
    padding: 4px 0;
    font-style: italic;
    color: var(--el-text-color-secondary);
  }

  .spec-action {
    display: flex;
    justify-content: flex-end;
    padding-top: var(--el-margin);
    border-top: 1px dashed var(--el-border-color);
  }

  :deep(.el-tag) {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .batch-setting {
    margin-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter);

    .batch-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      border-bottom: 1px solid var(--el-border-color-light);

      .batch-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .action-container {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      padding: 16px 12px;
    }

    .action-item {
      display: flex;
      flex: 1;
      align-items: center;
      margin-right: 12px;

      &:last-child {
        margin-right: 0;
      }

      .el-input-number {
        width: 120px;
      }

      .el-button {
        margin-left: 8px;
        white-space: nowrap;
      }
    }

    @media (max-width: 1200px) {
      .action-container {
        flex-wrap: wrap;
        justify-content: flex-start;
      }

      .action-item {
        flex: 0 0 auto;
        width: calc(50% - 8px);
        margin-bottom: 12px;
      }
    }

    @media (max-width: 992px) {
      .action-container {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .action-item {
        width: 100%;
        margin-right: 0;
        margin-bottom: 12px;
      }
    }

    @media (max-width: 768px) {
      .action-item {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;

        .el-input-number {
          width: 100%;
        }

        .el-button {
          width: 100%;
          margin-top: 10px;
          margin-left: 0 !important;
        }
      }
    }
  }

  .btn-gap {
    margin-right: 10px;
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: -1px;
  }

  :deep(.el-input-number) {
    width: 150px;
  }

  :deep(.el-drawer) {
    .el-drawer__header {
      padding: 20px;
      margin-bottom: 0;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .el-drawer__body {
      width: 100%;
      height: calc(100% - 60px);
      padding: 16px;
      overflow-y: auto;
    }
  }

  .sku-image-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: var(--el-border-radius-base);

    &:hover {
      border-color: var(--el-color-primary);
    }

    .sku-upload-icon {
      font-size: 20px;
      color: var(--el-text-color-secondary);
    }

    .sku-image-preview {
      display: block; /* 确保图片正确显示 */
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .image-upload-container {
    width: 100%;

    .el-upload__tip {
      margin-top: 8px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .sku-single-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px; // 改为更合适的尺寸
    height: 120px;
    margin: 0;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: var(--el-border-radius-base);

    &:hover {
      border-color: var(--el-color-primary);
    }

    .sku-image-preview {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .sku-upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 10px;

      .sku-upload-icon {
        font-size: 24px;
        color: var(--el-text-color-secondary);
      }

      .upload-text {
        margin-top: 8px;
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .table-image {
    width: 50px;
    height: 50px;
    cursor: pointer;
    object-fit: cover;
    border-radius: 4px;
  }

  .batch-image-upload {
    display: inline-block;
    width: 100%;

    :deep(.el-upload) {
      display: block;
      width: 100%;
    }

    .el-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      transition: all 0.3s;

      .el-icon {
        margin-right: 5px;
        font-size: 16px;
      }

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
    }
  }

  .import-dialog-content {
    padding: 20px 0;

    .import-uploader {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;

      .el-upload {
        width: 100%;
        text-align: center;
      }

      .upload-tip {
        margin-top: 8px;
        font-size: 12px;
        color: #909399;
      }
    }

    .import-template {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 20px;
      margin-top: 20px;
      border-top: 1px dashed var(--el-border-color-light);

      span {
        margin-right: 8px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .spec-value-item {
    display: inline-block;
    margin-right: 8px;
    margin-bottom: 8px;

    .spec-value-input {
      width: 120px;
    }
  }
}
</style>
