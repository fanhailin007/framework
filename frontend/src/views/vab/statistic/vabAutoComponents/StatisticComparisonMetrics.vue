<template>
  <div class="metrics-comparison">
    <div v-for="metric in comparisonMetricsData" :key="metric.name" class="metric-item">
      <div class="metric-header">
        <div class="metric-name">{{ metric.name }}</div>
        <div class="metric-change" :class="getChangeClass(metric.change)">
          <el-icon :size="12">
            <component :is="getChangeIcon(metric.change)" />
          </el-icon>
          <span>{{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%</span>
        </div>
      </div>
      <div class="metric-values">
        <div class="value-item">
          <span class="value-label">本期</span>
          <span class="value-number">{{ metric.current }}</span>
        </div>
        <div class="value-item">
          <span class="value-label">上期</span>
          <span class="value-number">{{ metric.previous }}</span>
        </div>
        <div class="value-item">
          <span class="value-label">差值</span>
          <span class="value-diff" :class="getChangeClass(metric.change)">
            {{ metric.difference > 0 ? '+' : '' }}{{ metric.difference }}
          </span>
        </div>
      </div>
      <div class="metric-bar">
        <div class="bar-container">
          <div class="bar-item">
            <div class="bar-label">上期</div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: metric.previousPercent + '%' }"></div>
            </div>
            <div class="bar-value">{{ metric.previous }}</div>
          </div>
          <div class="bar-item">
            <div class="bar-label">本期</div>
            <div class="bar-track">
              <div class="bar-fill current" :style="{ width: metric.currentPercent + '%' }"></div>
            </div>
            <div class="bar-value">{{ metric.current }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

defineOptions({
  name: 'StatisticComparisonMetrics',
})

// 指标对比数据
const comparisonMetricsData = ref([
  {
    name: '销售额',
    current: 1256789,
    previous: 1098765,
    change: 14.4,
    difference: 158024,
    currentPercent: 100,
    previousPercent: 87.4,
  },
])

// 获取变化类型样式
const getChangeClass = (change: number) => {
  return change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
}

// 获取变化图标
const getChangeIcon = (change: number) => {
  return change > 0 ? ArrowUp : change < 0 ? ArrowDown : null
}
</script>

<style lang="scss" scoped>
.metrics-comparison {
  .metric-item {
    padding: 16px;
    margin-bottom: 24px;
    background: var(--el-bg-color-page);
    border-radius: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .metric-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .metric-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .metric-change {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;

        &.up {
          color: var(--el-color-success);
        }

        &.down {
          color: var(--el-color-danger);
        }

        &.neutral {
          color: var(--el-text-color-regular);
        }

        .el-icon {
          margin-right: 4px;
        }
      }
    }

    .metric-values {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 16px;

      .value-item {
        text-align: center;

        .value-label {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          color: var(--el-text-color-regular);
        }

        .value-number {
          font-size: 18px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .value-diff {
          font-size: 18px;
          font-weight: 600;

          &.up {
            color: var(--el-color-success);
          }

          &.down {
            color: var(--el-color-danger);
          }

          &.neutral {
            color: var(--el-text-color-regular);
          }
        }
      }
    }

    .metric-bar {
      .bar-container {
        .bar-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }

          .bar-label {
            width: 40px;
            font-size: 12px;
            color: var(--el-text-color-regular);
          }

          .bar-track {
            flex: 1;
            height: 8px;
            margin: 0 12px;
            overflow: hidden;
            background: var(--el-border-color-lighter);
            border-radius: 4px;

            .bar-fill {
              height: 100%;
              background: var(--el-color-primary);
              border-radius: 4px;
              transition: width 0.3s ease;

              &.current {
                background: var(--el-color-success);
              }
            }
          }

          .bar-value {
            width: 60px;
            font-size: 12px;
            color: var(--el-text-color-regular);
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
