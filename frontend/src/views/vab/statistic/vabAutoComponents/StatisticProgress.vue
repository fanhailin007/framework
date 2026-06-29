<template>
  <el-row :gutter="20">
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="progress-stat">
        <div class="progress-header">
          <span>项目完成度</span>
          <span class="progress-value">{{ progressData.project }}%</span>
        </div>
        <el-progress :color="progressColors" :percentage="progressData.project" :stroke-width="8" />
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="progress-stat">
        <div class="progress-header">
          <span>任务完成度</span>
          <span class="progress-value">{{ progressData.task }}%</span>
        </div>
        <el-progress :color="progressColors" :percentage="progressData.task" :stroke-width="8" />
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="progress-stat">
        <div class="progress-header">
          <span>代码覆盖率</span>
          <span class="progress-value">{{ progressData.coverage }}%</span>
        </div>
        <el-progress :color="progressColors" :percentage="progressData.coverage" :stroke-width="8" />
      </div>
    </el-col>
    <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
      <div class="progress-stat">
        <div class="progress-header">
          <span>测试通过率</span>
          <span class="progress-value">{{ progressData.test }}%</span>
        </div>
        <el-progress :color="progressColors" :percentage="progressData.test" :stroke-width="8" />
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'StatisticProgress',
})

// 进度数据
const progressData = ref({
  project: 85,
  task: 72,
  coverage: 96,
  test: 98,
})

// 进度条颜色
const progressColors = [
  { color: 'var(--el-color-danger)', percentage: 20 },
  { color: 'var(--el-color-warning)', percentage: 40 },
  { color: 'var(--el-color-success)', percentage: 60 },
  { color: 'var(--el-color-primary)', percentage: 80 },
  { color: 'var(--el-color-info)', percentage: 100 },
]
</script>

<style lang="scss" scoped>
// 进度统计
.progress-stat {
  padding: 16px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    color: var(--el-text-color-primary);

    .progress-value {
      font-weight: 600;
      color: var(--el-color-primary);
    }
  }
}
</style>
