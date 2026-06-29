<template>
  <el-row :gutter="20">
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="real-time-stat">
        <div class="stat-icon primary">
          <el-icon :size="24">
            <user />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">
            <vab-count :end-value="realTimeData.users" :start-value="0" />
          </div>
          <div class="stat-label">在线用户</div>
          <div class="stat-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+12.5%</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="real-time-stat">
        <div class="stat-icon success">
          <el-icon :size="24">
            <shopping-cart />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">
            <vab-count :end-value="realTimeData.orders" :start-value="0" />
          </div>
          <div class="stat-label">今日订单</div>
          <div class="stat-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+8.3%</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="real-time-stat">
        <div class="stat-icon warning">
          <el-icon :size="24">
            <money />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">
            ¥
            <vab-count :end-value="realTimeData.revenue" :start-value="0" />
          </div>
          <div class="stat-label">今日收入</div>
          <div class="stat-trend down">
            <el-icon :size="12">
              <arrow-down />
            </el-icon>
            <span>-2.1%</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="real-time-stat">
        <div class="stat-icon info">
          <el-icon :size="24">
            <monitor />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">
            <vab-count :end-value="realTimeData.views" :start-value="0" />
          </div>
          <div class="stat-label">页面访问</div>
          <div class="stat-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+15.7%</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowUp, Money, Monitor, ShoppingCart, User } from '@element-plus/icons-vue'

defineOptions({
  name: 'StatisticRealTime',
})

// 实时数据
const realTimeData = ref({
  users: 2847,
  orders: 156,
  revenue: 45678,
  views: 12543,
})
</script>

<style lang="scss" scoped>
// 实时数据监控
.real-time-stat {
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

    &.info {
      background: var(--el-color-info);
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
