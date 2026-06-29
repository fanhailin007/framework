<template>
  <div class="comparison-settings">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <div class="setting-item">
          <label>对比维度</label>
          <el-select v-model="comparisonDimension" placeholder="选择对比维度" style="width: 100%">
            <el-option label="时间对比" value="time" />
            <el-option label="地区对比" value="region" />
            <el-option label="产品对比" value="product" />
            <el-option label="渠道对比" value="channel" />
          </el-select>
        </div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <div class="setting-item">
          <label>时间范围</label>
          <el-date-picker
            v-model="timeRange"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            style="width: 100%"
            type="daterange"
          />
        </div>
      </el-col>
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <div class="setting-item">
          <label>对比指标</label>
          <el-select v-model="comparisonMetrics" multiple placeholder="选择对比指标" style="width: 100%">
            <el-option label="销售额" value="sales" />
            <el-option label="订单数" value="orders" />
            <el-option label="用户数" value="users" />
            <el-option label="转化率" value="conversion" />
            <el-option label="客单价" value="avgOrder" />
          </el-select>
        </div>
      </el-col>
    </el-row>
    <div class="setting-actions">
      <el-button type="primary" @click="generateComparison">
        <el-icon>
          <data-analysis />
        </el-icon>
        生成对比
      </el-button>
      <el-button @click="exportComparison">
        <el-icon>
          <download />
        </el-icon>
        导出报告
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DataAnalysis, Download } from '@element-plus/icons-vue'

defineOptions({
  name: 'StatisticComparisonSettings',
})

// 对比设置
const comparisonDimension = ref('time')
const timeRange = ref<[Date, Date]>()
const comparisonMetrics = ref(['sales', 'orders'])

// 生成对比
const generateComparison = () => {
  console.log('生成对比分析', {
    dimension: comparisonDimension.value,
    timeRange: timeRange.value,
    metrics: comparisonMetrics.value,
  })
}

// 导出报告
const exportComparison = () => {
  console.log('导出对比报告')
}
</script>

<style lang="scss" scoped>
// 对比分析设置
.comparison-settings {
  .setting-item {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }

  .setting-actions {
    display: flex;
    gap: 12px;
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}
</style>
