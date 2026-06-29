<template>
  <div class="statistic-container no-background-container">
    <!-- 仪表板统计 -->
    <vab-card :body-style="{ paddingBottom: 0 }">
      <template #header>仪表板风格</template>
      <statistic-dashboard />
    </vab-card>

    <!-- 数据分析 -->
    <vab-card>
      <template #header>数据分析概览</template>
      <statistic-analytics-overview />
    </vab-card>

    <!-- 迷你统计 -->
    <vab-card>
      <template #header>迷你统计</template>
      <statistic-mini />
    </vab-card>

    <!-- 预测分析 -->
    <vab-card>
      <template #header>预测分析</template>
      <statistic-prediction />
    </vab-card>

    <!-- 数据卡片 -->
    <vab-card :body-style="{ paddingBottom: 0 }">
      <template #header>数据卡片</template>
      <statistic-data-card />
    </vab-card>

    <!-- 实时数据监控 -->
    <vab-card>
      <template #header>实时数据监控</template>
      <statistic-real-time />
    </vab-card>

    <!-- 销售趋势分析 -->
    <vab-card>
      <template #header>销售趋势分析</template>
      <statistic-trend />
    </vab-card>

    <!-- 指标对比详情 -->
    <vab-card>
      <template #header>指标对比详情</template>
      <statistic-comparison-metrics />
    </vab-card>

    <!-- 详细对比表格 -->
    <vab-card>
      <template #header>详细对比表格</template>
      <statistic-comparison-table />
    </vab-card>

    <!-- 进度统计 -->
    <vab-card>
      <template #header>进度统计</template>
      <statistic-progress />
    </vab-card>

    <!-- 基础统计 -->
    <vab-card>
      <template #header>基础用法</template>
      <statistic-basic />
    </vab-card>

    <!-- 倒计时统计 -->
    <vab-card>
      <template #header>倒计时</template>
      <statistic-countdown />
    </vab-card>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Statistic',
})
</script>

<style lang="scss" scoped>
.statistic-container {
  .el-card {
    margin-bottom: var(--el-margin);

    &:last-child {
      margin-bottom: 0;
    }

    // 为卡片内容添加间距
    :deep(.el-card__body) {
      padding: var(--el-padding);
    }

    // 为子项添加间距
    :deep(.el-row) {
      margin-bottom: 0;
    }

    :deep(.el-col) {
      &:has(.kpi-card),
      &:has(.data-card) {
        margin-bottom: var(--el-margin);
      }
    }

    // 为统计卡片添加间距
    :deep(.statistic-card),
    :deep(.data-card),
    :deep(.analytics-card),
    :deep(.prediction-stat),
    :deep(.kpi-card) {
      margin-bottom: var(--el-margin);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
