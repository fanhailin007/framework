<template>
  <div class="user-behavior">
    <div class="behavior-item">
      <div class="behavior-label">
        <span>新用户注册</span>
        <el-tooltip content="今日新注册用户数量" placement="top">
          <el-icon :size="14">
            <question-filled />
          </el-icon>
        </el-tooltip>
      </div>
      <div class="behavior-progress">
        <el-progress :color="customColors" :percentage="userBehavior.newUsers" :stroke-width="8" />
        <span class="progress-text">{{ userBehavior.newUsers }}%</span>
      </div>
    </div>
    <div class="behavior-item">
      <div class="behavior-label">
        <span>活跃用户</span>
        <el-tooltip content="今日活跃用户比例" placement="top">
          <el-icon :size="14">
            <question-filled />
          </el-icon>
        </el-tooltip>
      </div>
      <div class="behavior-progress">
        <el-progress :color="customColors" :percentage="userBehavior.activeUsers" :stroke-width="8" />
        <span class="progress-text">{{ userBehavior.activeUsers }}%</span>
      </div>
    </div>
    <div class="behavior-item">
      <div class="behavior-label">
        <span>转化率</span>
        <el-tooltip content="访问到购买的用户比例" placement="top">
          <el-icon :size="14">
            <question-filled />
          </el-icon>
        </el-tooltip>
      </div>
      <div class="behavior-progress">
        <el-progress :color="customColors" :percentage="userBehavior.conversionRate" :stroke-width="8" />
        <span class="progress-text">{{ userBehavior.conversionRate }}%</span>
      </div>
    </div>
    <div class="behavior-item">
      <div class="behavior-label">
        <span>留存率</span>
        <el-tooltip content="次日留存用户比例" placement="top">
          <el-icon :size="14">
            <question-filled />
          </el-icon>
        </el-tooltip>
      </div>
      <div class="behavior-progress">
        <el-progress :color="customColors" :percentage="userBehavior.retentionRate" :stroke-width="8" />
        <span class="progress-text">{{ userBehavior.retentionRate }}%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled } from '@element-plus/icons-vue'

defineOptions({
  name: 'StatisticUserBehavior',
})

// 用户行为数据
const userBehavior = ref({
  newUsers: 85,
  activeUsers: 72,
  conversionRate: 15,
  retentionRate: 68,
})

// 自定义颜色
const customColors = [
  { color: 'var(--el-color-danger)', percentage: 20 },
  { color: 'var(--el-color-warning)', percentage: 40 },
  { color: 'var(--el-color-success)', percentage: 60 },
  { color: 'var(--el-color-primary)', percentage: 80 },
  { color: 'var(--el-color-info)', percentage: 100 },
]
</script>

<style lang="scss" scoped>
// 用户行为分析
.user-behavior {
  .behavior-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .behavior-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--el-text-color-primary);

      .el-icon {
        color: var(--el-text-color-regular);
        cursor: help;
      }
    }

    .behavior-progress {
      display: flex;
      gap: 12px;
      align-items: center;

      .el-progress {
        flex: 1;
      }

      .progress-text {
        min-width: 40px;
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        text-align: right;
      }
    }
  }
}
</style>
