<template>
  <el-table :data="comparisonTable" stripe style="width: 100%">
    <el-table-column label="指标" prop="metric" width="150" />
    <el-table-column label="本期值" prop="current" width="120" />
    <el-table-column label="上期值" prop="previous" width="120" />
    <el-table-column label="变化率" prop="change" width="120">
      <template #default="scope">
        <span :class="getChangeClass(scope.row.change)">{{ scope.row.change > 0 ? '+' : '' }}{{ scope.row.change }}%</span>
      </template>
    </el-table-column>
    <el-table-column label="差值" prop="difference" width="120">
      <template #default="scope">
        <span :class="getChangeClass(scope.row.change)">{{ scope.row.difference > 0 ? '+' : '' }}{{ scope.row.difference }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="status" width="100">
      <template #default="scope">
        <el-tag size="small" :type="getStatusType(scope.row.change)">
          {{ getStatusText(scope.row.change) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="趋势" min-width="120" prop="trend">
      <template #default="scope">
        <div class="trend-indicator">
          <div class="trend-line" :class="getChangeClass(scope.row.change)">
            <div v-for="(point, index) in scope.row.trendData" :key="index" class="trend-point" :style="{ height: point + '%' }"></div>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'StatisticComparisonTable',
})

// 对比表格数据
const comparisonTable = ref([
  {
    metric: '销售额',
    current: 1256789,
    previous: 1098765,
    change: 14.4,
    difference: 158024,
    trendData: [20, 35, 45, 60, 80, 100],
  },
  {
    metric: '订单数',
    current: 3456,
    previous: 3123,
    change: 10.7,
    difference: 333,
    trendData: [30, 40, 55, 70, 85, 100],
  },
  {
    metric: '用户数',
    current: 2847,
    previous: 2654,
    change: 7.3,
    difference: 193,
    trendData: [25, 35, 50, 65, 80, 100],
  },
  {
    metric: '转化率',
    current: 15.2,
    previous: 13.8,
    change: 10.1,
    difference: 1.4,
    trendData: [40, 50, 60, 75, 90, 100],
  },
  {
    metric: '客单价',
    current: 364,
    previous: 352,
    change: 3.4,
    difference: 12,
    trendData: [60, 70, 80, 85, 95, 100],
  },
])

// 获取变化类型样式
const getChangeClass = (change: number) => {
  return change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
}

// 获取状态类型
const getStatusType = (change: number) => {
  if (change > 10) return 'success'
  if (change > 0) return 'warning'
  if (change < -10) return 'danger'
  return 'info'
}

// 获取状态文本
const getStatusText = (change: number) => {
  if (change > 10) return '优秀'
  if (change > 0) return '良好'
  if (change < -10) return '异常'
  return '正常'
}
</script>

<style lang="scss" scoped>
.trend-indicator {
  .trend-line {
    display: flex;
    gap: 2px;
    align-items: end;
    height: 20px;

    &.up {
      .trend-point {
        background: var(--el-color-success);
      }
    }

    &.down {
      .trend-point {
        background: var(--el-color-danger);
      }
    }

    &.neutral {
      .trend-point {
        background: var(--el-text-color-regular);
      }
    }

    .trend-point {
      flex: 1;
      min-width: 2px;
      border-radius: 1px;
      transition: all 0.3s ease;
    }
  }
}
</style>
