<template>
  <el-row :gutter="20">
    <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
      <div class="data-card today-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon class="title-icon" :size="20">
              <sunny />
            </el-icon>
            今日概览
          </div>
          <el-tag effect="dark" size="small" type="success">
            <el-icon :size="12">
              <refresh />
            </el-icon>
            实时
          </el-tag>
        </div>
        <div class="card-body">
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <user />
              </el-icon>
              <span class="data-label">新增用户</span>
            </div>
            <span class="data-value">{{ dataCard.today.newUsers }}</span>
          </div>
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <shopping-cart />
              </el-icon>
              <span class="data-label">新增订单</span>
            </div>
            <span class="data-value">{{ dataCard.today.newOrders }}</span>
          </div>
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <money />
              </el-icon>
              <span class="data-label">新增收入</span>
            </div>
            <span class="data-value">¥{{ dataCard.today.newRevenue }}</span>
          </div>
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <monitor />
              </el-icon>
              <span class="data-label">新增访问</span>
            </div>
            <span class="data-value">{{ dataCard.today.newViews }}</span>
          </div>
        </div>
        <div class="card-bg-decoration"></div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
      <div class="data-card week-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon class="title-icon" :size="20">
              <calendar />
            </el-icon>
            本周统计
          </div>
          <el-tag effect="dark" size="small" type="warning">
            <el-icon :size="12">
              <data-analysis />
            </el-icon>
            汇总
          </el-tag>
        </div>
        <div class="card-body">
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <user-filled />
              </el-icon>
              <span class="data-label">总用户数</span>
            </div>
            <span class="data-value">{{ dataCard.week.totalUsers }}</span>
          </div>
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <shopping-bag />
              </el-icon>
              <span class="data-label">总订单数</span>
            </div>
            <span class="data-value">{{ dataCard.week.totalOrders }}</span>
          </div>
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <wallet />
              </el-icon>
              <span class="data-label">总收入</span>
            </div>
            <span class="data-value">¥{{ dataCard.week.totalRevenue }}</span>
          </div>
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <monitor />
              </el-icon>
              <span class="data-label">总访问量</span>
            </div>
            <span class="data-value">{{ dataCard.week.totalViews }}</span>
          </div>
        </div>
        <div class="card-bg-decoration"></div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
      <div class="data-card month-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon class="title-icon" :size="20">
              <trend-charts />
            </el-icon>
            本月趋势
          </div>
          <el-tag effect="dark" size="small" type="info">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            趋势
          </el-tag>
        </div>
        <div class="card-body">
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <user />
              </el-icon>
              <span class="data-label">用户增长</span>
            </div>
            <span class="data-value trend-up">
              <el-icon :size="12">
                <arrow-up />
              </el-icon>
              +{{ dataCard.month.userGrowth }}%
            </span>
          </div>
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <shopping-cart />
              </el-icon>
              <span class="data-label">订单增长</span>
            </div>
            <span class="data-value trend-up">
              <el-icon :size="12">
                <arrow-up />
              </el-icon>
              +{{ dataCard.month.orderGrowth }}%
            </span>
          </div>
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <money />
              </el-icon>
              <span class="data-label">收入增长</span>
            </div>
            <span class="data-value trend-down">
              <el-icon :size="12">
                <arrow-down />
              </el-icon>
              -{{ dataCard.month.revenueDecline }}%
            </span>
          </div>
          <div class="data-row">
            <div class="data-info">
              <el-icon class="data-icon" :size="16">
                <monitor />
              </el-icon>
              <span class="data-label">访问增长</span>
            </div>
            <span class="data-value trend-up">
              <el-icon :size="12">
                <arrow-up />
              </el-icon>
              +{{ dataCard.month.viewGrowth }}%
            </span>
          </div>
        </div>
        <div class="card-bg-decoration"></div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  DataAnalysis,
  Money,
  Monitor,
  Refresh,
  ShoppingBag,
  ShoppingCart,
  Sunny,
  TrendCharts,
  User,
  UserFilled,
  Wallet,
} from '@element-plus/icons-vue'

defineOptions({
  name: 'StatisticDataCard',
})

// 数据卡片
const dataCard = ref({
  today: {
    newUsers: 45,
    newOrders: 23,
    newRevenue: 12345,
    newViews: 1234,
  },
  week: {
    totalUsers: 2847,
    totalOrders: 156,
    totalRevenue: 45678,
    totalViews: 12543,
  },
  month: {
    userGrowth: 12.5,
    orderGrowth: 8.7,
    revenueDecline: 2.1,
    viewGrowth: 15.3,
  },
})
</script>

<style lang="scss" scoped>
// 数据卡片
.data-card {
  position: relative;
  height: 100%;
  padding: 24px;
  overflow: hidden;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: var(--el-color-primary-light-7);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }

  // 背景装饰
  .card-bg-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    pointer-events: none;
    background: linear-gradient(135deg, transparent 50%, rgba(var(--el-color-primary-rgb), 0.05) 50%);
    border-radius: 0 12px 0 100px;
  }

  .card-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;

    .card-title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);

      .title-icon {
        margin-right: 8px;
        color: var(--el-color-primary);
      }
    }
  }

  .card-body {
    position: relative;
    z-index: 1;

    .data-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      margin-bottom: 16px;
      background: var(--el-bg-color-page);
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        background: var(--el-color-primary-light-9);
        transform: translateX(4px);
      }

      &:last-child {
        margin-bottom: 0;
      }

      .data-info {
        display: flex;
        align-items: center;

        .data-icon {
          margin-right: 8px;
          color: var(--el-color-primary);
        }

        .data-label {
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
      }

      .data-value {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);

        .el-icon {
          margin-right: 4px;
        }

        &.trend-up {
          color: var(--el-color-success);
        }

        &.trend-down {
          color: var(--el-color-danger);
        }
      }
    }
  }

  // 不同卡片的主题色
  &.today-card {
    .card-bg-decoration {
      background: linear-gradient(135deg, transparent 50%, rgba(var(--el-color-success-rgb), 0.05) 50%);
    }
  }

  &.week-card {
    .card-bg-decoration {
      background: linear-gradient(135deg, transparent 50%, rgba(var(--el-color-warning-rgb), 0.05) 50%);
    }
  }

  &.month-card {
    .card-bg-decoration {
      background: linear-gradient(135deg, transparent 50%, rgba(var(--el-color-info-rgb), 0.05) 50%);
    }
  }
}
</style>
