<template>
  <div class="statistic-dashboard">
    <!-- 顶部KPI指标 -->
    <el-row class="mb-20 kpi-row" :gutter="20">
      <el-col :lg="6" :md="12" :sm="12" :xl="6" :xs="24">
        <div class="kpi-card primary">
          <div class="kpi-icon">
            <el-icon :size="32">
              <component :is="kpiList[0].icon" />
            </el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">
              <vab-count :end-value="kpiData.revenue" :start-value="0" />
            </div>
            <div class="kpi-label">{{ kpiList[0].label }}</div>
            <div class="kpi-trend up">
              <el-icon :size="14">
                <component :is="kpiList[0].trendIcon" />
              </el-icon>
              <span>+{{ kpiData.revenueGrowth }}%</span>
            </div>
          </div>
          <div class="kpi-chart">
            <div class="mini-chart">
              <div v-for="(point, index) in kpiData.revenueChart" :key="index" class="chart-bar" :style="{ height: point + '%' }"></div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xl="6" :xs="24">
        <div class="kpi-card success">
          <div class="kpi-icon">
            <el-icon :size="32">
              <component :is="kpiList[1].icon" />
            </el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">
              <vab-count :end-value="kpiData.orders" :start-value="0" />
            </div>
            <div class="kpi-label">{{ kpiList[1].label }}</div>
            <div class="kpi-trend up">
              <el-icon :size="14">
                <component :is="kpiList[1].trendIcon" />
              </el-icon>
              <span>+{{ kpiData.ordersGrowth }}%</span>
            </div>
          </div>
          <div class="kpi-chart">
            <div class="mini-chart">
              <div v-for="(point, index) in kpiData.ordersChart" :key="index" class="chart-bar" :style="{ height: point + '%' }"></div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xl="6" :xs="24">
        <div class="kpi-card warning">
          <div class="kpi-icon">
            <el-icon :size="32">
              <component :is="kpiList[2].icon" />
            </el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">
              <vab-count :end-value="kpiData.users" :start-value="0" />
            </div>
            <div class="kpi-label">{{ kpiList[2].label }}</div>
            <div class="kpi-trend down">
              <el-icon :size="14">
                <component :is="kpiList[2].trendIcon" />
              </el-icon>
              <span>-{{ kpiData.usersDecline }}%</span>
            </div>
          </div>
          <div class="kpi-chart">
            <div class="mini-chart">
              <div v-for="(point, index) in kpiData.usersChart" :key="index" class="chart-bar" :style="{ height: point + '%' }"></div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :lg="6" :md="12" :sm="12" :xl="6" :xs="24">
        <div class="kpi-card purple">
          <div class="kpi-icon">
            <el-icon :size="32">
              <component :is="kpiList[3].icon" />
            </el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">
              <vab-count :end-value="kpiData.newUsers" :start-value="0" />
            </div>
            <div class="kpi-label">{{ kpiList[3].label }}</div>
            <div class="kpi-trend up">
              <el-icon :size="14">
                <component :is="kpiList[3].trendIcon" />
              </el-icon>
              <span>+{{ kpiData.newUsersGrowth }}%</span>
            </div>
          </div>
          <div class="kpi-chart">
            <div class="mini-chart">
              <div v-for="(point, index) in kpiData.newUsersChart" :key="index" class="chart-bar" :style="{ height: point + '%' }"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowUp, Coin, Money, ShoppingBag, User } from '@element-plus/icons-vue'

// KPI数据
const kpiData = ref({
  revenue: 1256789,
  revenueGrowth: 15.2,
  revenueChart: [65, 78, 45, 89, 67, 82, 91],
  orders: 3456,
  ordersGrowth: 8.7,
  ordersChart: [45, 67, 34, 78, 56, 89, 67],
  users: 2847,
  usersDecline: 2.1,
  usersChart: [78, 65, 89, 67, 45, 78, 56],
  views: 12543,
  viewsGrowth: 12.5,
  viewsChart: [89, 67, 78, 45, 67, 89, 78],
  newUsers: 512,
  newUsersGrowth: 6.3,
  newUsersChart: [55, 60, 58, 62, 65, 70, 68],
})

const kpiList = [
  {
    key: 'revenue',
    label: '总收入',
    icon: Money,
    color: 'primary',
    valueField: 'revenue',
    trendField: 'revenueGrowth',
    trendType: 'up',
    chartField: 'revenueChart',
    trendIcon: ArrowUp,
    trendPrefix: '+',
    trendSuffix: '%',
  },
  {
    key: 'orders',
    label: '总订单',
    icon: ShoppingBag,
    color: 'success',
    valueField: 'orders',
    trendField: 'ordersGrowth',
    trendType: 'up',
    chartField: 'ordersChart',
    trendIcon: ArrowUp,
    trendPrefix: '+',
    trendSuffix: '%',
  },
  {
    key: 'users',
    label: '活跃用户',
    icon: User,
    color: 'warning',
    valueField: 'users',
    trendField: 'usersDecline',
    trendType: 'down',
    chartField: 'usersChart',
    trendIcon: ArrowDown,
    trendPrefix: '-',
    trendSuffix: '%',
  },
  {
    key: 'volume',
    label: '成交量',
    icon: Coin,
    color: 'purple',
    valueField: 'newUsers',
    trendField: 'newUsersGrowth',
    trendType: 'up',
    chartField: 'newUsersChart',
    trendIcon: ArrowUp,
    trendPrefix: '+',
    trendSuffix: '%',
  },
]
</script>

<style lang="scss" scoped>
.statistic-dashboard {
  .mb-20 {
    margin-bottom: 20px;
  }

  .kpi-row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -10px;
    margin-left: -10px;
  }

  .kpi-col {
    box-sizing: border-box;
    flex: 0 0 20%;
    max-width: 20%;
    padding-right: 10px;
    padding-left: 10px;
  }

  @media (max-width: 1200px) {
    .kpi-col {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
  }
  @media (max-width: 900px) {
    .kpi-col {
      flex: 0 0 50%;
      max-width: 50%;
    }
  }
  @media (max-width: 600px) {
    .kpi-col {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  // KPI卡片
  .kpi-card {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 168px;
    padding: 24px;
    overflow: hidden;
    background: var(--el-bg-color-overlay);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      transform: translateY(-4px);
    }

    &.primary {
      color: white;
      background: var(--el-color-primary);

      .kpi-icon {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
      }
    }

    &.success {
      color: white;
      background: var(--el-color-success);

      .kpi-icon {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
      }
    }

    &.warning {
      color: white;
      background: var(--el-color-warning);

      .kpi-icon {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
      }
    }

    &.danger {
      color: white;
      background: var(--el-color-info);

      .kpi-icon {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
      }
    }

    &.purple {
      color: white;
      background: #a259ec;

      .kpi-icon {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
      }
    }

    .kpi-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin-right: 16px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        transform: scale(1.05);
      }
    }

    .kpi-content {
      flex: 1;

      .kpi-value {
        font-size: 28px;
        font-weight: 700;
        line-height: 1.2;
      }

      .kpi-label {
        margin-top: 4px;
        font-size: 14px;
        opacity: 0.9;
      }

      .kpi-trend {
        display: flex;
        align-items: center;
        margin-top: 8px;
        font-size: 12px;
        font-weight: 600;

        &.up {
          color: rgba(255, 255, 255, 0.9);
        }

        &.down {
          color: rgba(255, 255, 255, 0.7);
        }

        .el-icon {
          margin-right: 4px;
        }
      }
    }

    .kpi-chart {
      position: absolute;
      right: 16px;
      bottom: 16px;
      width: 80px;
      height: 40px;

      .mini-chart {
        display: flex;
        gap: 2px;
        align-items: end;
        height: 100%;

        .chart-bar {
          flex: 1;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
      }
    }
  }

  // 图表头部
  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  // 图表容器
  .chart-container {
    .chart-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 20px;

      .chart-stat-item {
        padding: 16px;
        text-align: center;
        background: var(--el-bg-color-page);
        border-radius: 8px;

        .stat-number {
          font-size: 20px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .stat-label {
          margin-top: 4px;
          font-size: 12px;
          color: var(--el-text-color-regular);
        }
      }
    }

    .chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      background: var(--el-bg-color-page);
      border-radius: 8px;

      .placeholder-text {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .placeholder-desc {
        margin-top: 8px;
        font-size: 14px;
        color: var(--el-text-color-regular);
      }
    }
  }

  // 监控面板
  .monitor-panel {
    .monitor-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .monitor-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .monitor-metrics {
        .metric-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }

          .metric-label {
            font-size: 12px;
            color: var(--el-text-color-regular);
          }

          .metric-value {
            font-size: 12px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }

          .el-progress {
            width: 120px;
          }
        }
      }

      .online-users {
        .user-item {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 8px;

          :deep(.el-avatar) {
            padding: 5px;
            background: var(--el-bg-color-page);
            border: 1px solid var(--el-border-color-lighter);
          }

          .user-name {
            flex: 1;
            font-size: 14px;
            color: var(--el-text-color-primary);
          }

          .user-status {
            padding: 2px 6px;
            font-size: 12px;
            border-radius: 10px;

            &.online {
              color: var(--el-color-success);
              background: var(--el-color-success-light-9);
            }

            &.away {
              color: var(--el-color-warning);
              background: var(--el-color-warning-light-9);
            }

            &.busy {
              color: var(--el-color-danger);
              background: var(--el-color-danger-light-9);
            }
          }
        }
      }
    }
  }

  // 金额样式
  .amount {
    font-weight: 600;
    color: var(--el-color-primary);
  }
}
</style>
