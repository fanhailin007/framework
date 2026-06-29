<template>
  <div class="performance-monitor-container auto-height-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #409eff">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ avgLoadTime }}s</div>
              <div class="stat-label">平均加载时间</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #67c23a">
              <el-icon><Cpu /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ avgFps }}</div>
              <div class="stat-label">平均 FPS</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #e6a23c">
              <el-icon><Download /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ avgResourceSize }}KB</div>
              <div class="stat-label">平均资源大小</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #f56c6c">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ errorCount }}</div>
              <div class="stat-label">错误数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 查询表单 -->
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form inline label-width="80px" :model="queryForm" @submit.prevent>
          <el-form-item label="页面路径">
            <el-input v-model.trim="queryForm.pagePath" clearable placeholder="请输入页面路径" />
          </el-form-item>
          <el-form-item label="性能等级">
            <el-select v-model="queryForm.performanceLevel" clearable placeholder="请选择" style="width: 150px">
              <el-option label="优秀" value="excellent" />
              <el-option label="良好" value="good" />
              <el-option label="一般" value="fair" />
              <el-option label="差" value="poor" />
            </el-select>
          </el-form-item>
          <el-form-item label="周期">
            <el-date-picker
              v-model="queryForm.searchDate"
              end-placeholder="结束日期"
              start-placeholder="开始日期"
              type="daterange"
            />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" :loading="listLoading" type="primary" @click="queryData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :icon="Refresh" @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>

    <!-- 性能数据表格 -->
    <el-table v-loading="listLoading" :data="list" row-key="id" stripe>
      <el-table-column align="center" label="页面路径" min-width="180" prop="pagePath" />
      <el-table-column align="center" label="加载时间 (s)" min-width="100" prop="loadTime" sortable />
      <el-table-column align="center" label="FCP (s)" min-width="100" prop="fcp" sortable />
      <el-table-column align="center" label="LCP (s)" min-width="100" prop="lcp" sortable />
      <el-table-column align="center" label="FID (ms)" min-width="100" prop="fid" sortable />
      <el-table-column align="center" label="CLS" min-width="80" prop="cls" sortable />
      <el-table-column align="center" label="FPS" min-width="80" prop="fps" />
      <el-table-column align="center" label="资源大小 (KB)" min-width="100" prop="resourceSize" sortable />
      <el-table-column align="center" label="性能等级" min-width="100" prop="performanceLevel">
        <template #default="{ row }">
          <el-tag v-if="row.performanceLevel === 'excellent'" type="success">优秀</el-tag>
          <el-tag v-else-if="row.performanceLevel === 'good'" type="primary">良好</el-tag>
          <el-tag v-else-if="row.performanceLevel === 'fair'" type="warning">一般</el-tag>
          <el-tag v-else type="danger">差</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="访问时间" min-width="160" prop="accessTime" sortable />
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

    <!-- 性能趋势图表 -->
    <vab-card class="mt-4 chart-card">
      <template #header>
        <div class="card-header">
          <span>性能趋势图</span>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
import { Refresh, Search, Timer, Cpu, Download, CircleClose } from '@element-plus/icons-vue'
import { getPerformanceList, getPerformanceTrend } from '/@/api/performanceMonitor'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

defineOptions({
  name: 'PerformanceMonitor',
})

const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 统计数据
const avgLoadTime = ref<number>(0)
const avgFps = ref<number>(0)
const avgResourceSize = ref<number>(0)
const errorCount = ref<number>(0)

const queryForm = reactive<any>({
  pagePath: '',
  performanceLevel: '',
  searchDate: '',
  pageNo: 1,
  pageSize: 20,
})

const handleSizeChange = (value: number) => {
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: any) => {
  queryForm.pageNo = value
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const { data } = await getPerformanceList(queryForm)
    list.value = data.list
    total.value = data.total
    
    // 计算统计数据
    calculateStats(data.list)
    
    // 更新图表
    updateChart()
  } finally {
    listLoading.value = false
  }
}

const calculateStats = (list: any[]) => {
  if (!list || list.length === 0) {
    avgLoadTime.value = 0
    avgFps.value = 0
    avgResourceSize.value = 0
    errorCount.value = 0
    return
  }

  const totalLoadTime = list.reduce((sum, item) => sum + (item.loadTime || 0), 0)
  const totalFps = list.reduce((sum, item) => sum + (item.fps || 0), 0)
  const totalResourceSize = list.reduce((sum, item) => sum + (item.resourceSize || 0), 0)
  const errors = list.filter((item) => item.performanceLevel === 'poor').length

  avgLoadTime.value = Number((totalLoadTime / list.length).toFixed(2))
  avgFps.value = Math.round(totalFps / list.length)
  avgResourceSize.value = Math.round(totalResourceSize / list.length)
  errorCount.value = errors
}

const updateChart = async () => {
  if (!chartInstance) {
    console.log('图表实例未初始化')
    return
  }
  
  try {
    const { data } = await getPerformanceTrend({
      startDate: queryForm.searchDate?.[0] || '',
      endDate: queryForm.searchDate?.[1] || '',
    })
    
    console.log('趋势数据:', data)
    
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['加载时间', 'FCP', 'LCP', 'FPS'],
        top: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dates || [],
      },
      yAxis: [
        {
          type: 'value',
          name: '时间 (s)',
          position: 'left',
        },
        {
          type: 'value',
          name: 'FPS',
          position: 'right',
          min: 30,
          max: 60,
        },
      ],
      series: [
        {
          name: '加载时间',
          type: 'line',
          smooth: true,
          data: data.loadTimeTrend || [],
          itemStyle: { color: '#409eff' },
        },
        {
          name: 'FCP',
          type: 'line',
          smooth: true,
          data: data.fcpTrend || [],
          itemStyle: { color: '#67c23a' },
        },
        {
          name: 'LCP',
          type: 'line',
          smooth: true,
          data: data.lcpTrend || [],
          itemStyle: { color: '#e6a23c' },
        },
        {
          name: 'FPS',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: data.fpsTrend || [],
          itemStyle: { color: '#f56c6c' },
        },
      ],
    }
    
    chartInstance.setOption(option, true)
  } catch (error) {
    console.error('图表数据加载失败:', error)
  }
}

const initChart = () => {
  if (!chartRef.value) {
    console.log('图表 DOM 元素未找到')
    return
  }
  chartInstance = echarts.init(chartRef.value)
  console.log('图表初始化成功')
  
  // 立即加载一次图表数据
  updateChart()
  
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
}

const resetQueryForm = () => {
  ;(Object.keys(queryForm) as (keyof typeof queryForm)[]).forEach((key) => {
    if (key !== 'pageNo' && key !== 'pageSize') queryForm[key] = '' as never
  })
  queryForm.pageNo = 1
  queryData()
}

onMounted(() => {
  initChart()
  fetchData()
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>

<style lang="scss" scoped>
.performance-monitor-container {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.mt-4 {
  margin-top: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
}

.stat-content {
  flex: 1;
  margin-left: 15px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-card {
  :deep(.el-card__body) {
    padding: 10px;
  }
}

.chart-container {
  width: 100%;
  height: 400px;
}
</style>
