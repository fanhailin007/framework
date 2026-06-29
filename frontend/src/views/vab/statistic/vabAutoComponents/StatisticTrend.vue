<template>
  <el-row :gutter="20">
    <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
      <div class="trend-stat">
        <div class="stat-icon primary">
          <el-icon :size="24">
            <money />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ formatNumber(trendData.totalSales) }}</div>
          <div class="stat-label">总销售额</div>
          <div class="stat-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+{{ trendData.salesGrowth }}%</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
      <div class="trend-stat">
        <div class="stat-icon success">
          <el-icon :size="24">
            <shopping-cart />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">
            {{ formatNumber(trendData.totalOrders) }}
          </div>
          <div class="stat-label">总订单数</div>
          <div class="stat-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+{{ trendData.ordersGrowth }}%</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
      <div class="trend-stat">
        <div class="stat-icon warning">
          <el-icon :size="24">
            <trend-charts />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ formatNumber(trendData.avgOrder) }}</div>
          <div class="stat-label">平均订单</div>
          <div class="stat-trend down">
            <el-icon :size="12">
              <arrow-down />
            </el-icon>
            <span>-{{ trendData.avgOrderChange }}%</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowUp, Money, ShoppingCart, TrendCharts } from '@element-plus/icons-vue'

defineOptions({
  name: 'StatisticTrend',
})

// 趋势数据
const trendData = ref({
  totalSales: 1256789,
  totalOrders: 3456,
  avgOrder: 364,
  salesGrowth: 12.5,
  ordersGrowth: 8.7,
  avgOrderChange: 2.1,
})

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString()
}
</script>

<style lang="scss" scoped>
.trend-stat {
  display: flex;
  align-items: center;
  padding: 20px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin-right: 16px;
    color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &.primary {
      background: var(--el-color-primary);
    }

    &.success {
      background: var(--el-color-success);
    }

    &.warning {
      background: var(--el-color-warning);
    }
  }

  .stat-content {
    flex: 1;

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      line-height: 1.2;
      color: var(--el-text-color-primary);
    }

    .stat-label {
      margin-bottom: 4px;
      font-size: 14px;
      color: var(--el-text-color-regular);
    }

    .stat-trend {
      display: flex;
      align-items: center;
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
  }
}
</style>
