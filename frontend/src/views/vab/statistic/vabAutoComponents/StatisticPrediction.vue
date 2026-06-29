<template>
  <el-row :gutter="20">
    <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
      <div class="prediction-stat">
        <div class="stat-icon primary">
          <el-icon :size="24">
            <money />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ predictionData.sales }}</div>
          <div class="stat-label">销售预测</div>
          <div class="stat-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+{{ predictionData.salesGrowth }}%</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
      <div class="prediction-stat">
        <div class="stat-icon success">
          <el-icon :size="24">
            <shopping-cart />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ predictionData.orders }}</div>
          <div class="stat-label">订单预测</div>
          <div class="stat-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+{{ predictionData.ordersGrowth }}%</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
      <div class="prediction-stat">
        <div class="stat-icon warning">
          <el-icon :size="24">
            <user />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ predictionData.users }}</div>
          <div class="stat-label">用户预测</div>
          <div class="stat-trend up">
            <el-icon :size="12">
              <arrow-up />
            </el-icon>
            <span>+{{ predictionData.usersGrowth }}%</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ArrowUp, Money, ShoppingCart, User } from '@element-plus/icons-vue'

defineOptions({
  name: 'StatisticPrediction',
})

const predictionData = ref({
  sales: 156789,
  salesGrowth: 6.2,
  orders: 2345,
  ordersGrowth: 4.8,
  users: 1890,
  usersGrowth: 5.1,
})
</script>

<style lang="scss" scoped>
.prediction-stat {
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

      .el-icon {
        margin-right: 4px;
      }
    }
  }
}
</style>
