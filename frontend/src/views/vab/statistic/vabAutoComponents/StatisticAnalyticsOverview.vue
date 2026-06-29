<template>
  <el-row :gutter="20">
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="analytics-card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">转化率</div>
          </div>
          <div class="card-value">{{ analyticsData.conversionRate }}%</div>
          <div class="card-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+{{ analyticsData.conversionGrowth }}%</span>
          </div>
        </div>
        <div class="card-chart">
          <el-progress :color="conversionColors" :percentage="analyticsData.conversionRate" type="circle" :width="60" />
        </div>
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="analytics-card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">客单价</div>
          </div>
          <div class="card-value">¥{{ analyticsData.avgOrderValue }}</div>
          <div class="card-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+{{ analyticsData.avgOrderGrowth }}%</span>
          </div>
        </div>
        <div class="card-chart">
          <div class="sparkline">
            <div
              v-for="(point, index) in analyticsData.avgOrderChart"
              :key="index"
              class="sparkline-point"
              :style="{ height: point + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="analytics-card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">复购率</div>
          </div>
          <div class="card-value">{{ analyticsData.repurchaseRate }}%</div>
          <div class="card-trend down">
            <el-icon :size="12">
              <arrow-down />
            </el-icon>
            <span>-{{ analyticsData.repurchaseDecline }}%</span>
          </div>
        </div>
        <div class="card-chart">
          <el-progress :color="repurchaseColors" :percentage="analyticsData.repurchaseRate" type="circle" :width="60" />
        </div>
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="analytics-card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">留存率</div>
          </div>
          <div class="card-value">{{ analyticsData.retentionRate }}%</div>
          <div class="card-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+{{ analyticsData.retentionGrowth }}%</span>
          </div>
        </div>
        <div class="card-chart">
          <div class="sparkline">
            <div
              v-for="(point, index) in analyticsData.retentionChart"
              :key="index"
              class="sparkline-point"
              :style="{ height: point + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

defineOptions({
  name: 'StatisticAnalyticsOverview',
})

const analyticsData = ref({
  conversionRate: 18.2,
  conversionGrowth: 2.1,
  avgOrderValue: 364,
  avgOrderGrowth: 1.8,
  avgOrderChart: [40, 60, 80, 60, 90, 100],
  repurchaseRate: 23.5,
  repurchaseDecline: 0.7,
  retentionRate: 68.9,
  retentionGrowth: 3.2,
  retentionChart: [30, 50, 70, 60, 80, 100],
})

const conversionColors = [
  { color: 'var(--el-color-danger)', percentage: 20 },
  { color: 'var(--el-color-warning)', percentage: 40 },
  { color: 'var(--el-color-success)', percentage: 60 },
  { color: 'var(--el-color-primary)', percentage: 80 },
  { color: 'var(--el-color-info)', percentage: 100 },
]
const repurchaseColors = [
  { color: 'var(--el-color-danger)', percentage: 20 },
  { color: 'var(--el-color-warning)', percentage: 40 },
  { color: 'var(--el-color-success)', percentage: 60 },
  { color: 'var(--el-color-primary)', percentage: 80 },
  { color: 'var(--el-color-info)', percentage: 100 },
]
</script>

<style lang="scss" scoped>
.analytics-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 20px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .card-content {
    flex: 1;
    margin-right: 20px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }

  .card-value {
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .card-trend {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 500;

    &.up {
      color: var(--el-color-success);
    }

    &.down {
      color: var(--el-color-danger);
    }

    .el-icon {
      margin-right: 4px;
    }
  }

  .card-chart {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 80px;

    .el-progress {
      margin: 0;
    }

    .sparkline {
      display: flex;
      align-items: end;
      width: 60px;
      height: 24px;

      .sparkline-point {
        flex: 1;
        min-width: 2px;
        margin: 0 1px;
        background: var(--el-color-primary);
        border-radius: 1px;
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
