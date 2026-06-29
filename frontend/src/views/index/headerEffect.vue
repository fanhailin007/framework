<template>
  <div class="header-effect-container no-background-container">
    <vab-card>
      <template #header>头部液态玻璃效果</template>
      <el-form inline :model="form">
        <vab-alert v-if="isUnsupportedMode" type="warning">
          暗黑模式或非默认主题不支持液态玻璃效果设置，
          <span style="color: var(--el-color-primary); cursor: pointer" @click="resetToDefaultTheme">点我</span>
          切换至默认主题
        </vab-alert>
        <vab-alert v-else type="primary">开启液态玻璃后，滚动屏幕即可查看效果</vab-alert>
        <el-form-item label="开启/关闭" style="margin-bottom: 0">
          <el-switch v-model="form.enabled" :disabled="isUnsupportedMode" @change="saveSettings" />
        </el-form-item>
        <el-form-item v-if="form.enabled && !isUnsupportedMode" label="透明度" style="margin-bottom: 0">
          <el-slider
            v-model="form.opacity"
            :max="1"
            :min="0.55"
            :show-tooltip="true"
            :step="0.01"
            style="width: 120px; margin-left: 5px"
            @change="saveSettings"
          />
        </el-form-item>
      </el-form>
    </vab-card>
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
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { setGlassModeClass, useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'HeaderEffect',
})

const settingsStore = useSettingsStore()
const { theme, mode } = storeToRefs(settingsStore)

const isUnsupportedMode = computed(() => {
  // 暗黑模式或非默认主题不支持液态玻璃效果
  return mode.value === 'dark' || theme.value.themeName !== 'default'
})

const form = ref({
  enabled: false,
  opacity: 0.85,
})

const saveSettings = () => {
  settingsStore.$patch({
    theme: {
      ...theme.value,
      glassMode: form.value.enabled,
      glassOpacity: form.value.opacity,
    },
  })

  localStorage.setItem(
    'shop-vite-theme',
    JSON.stringify({
      ...theme.value,
      glassMode: form.value.enabled,
      glassOpacity: form.value.opacity,
    })
  )

  // 更新CSS变量
  settingsStore.setCssVar()
  // 更新液态玻璃效果类名
  setGlassModeClass(form.value.enabled)
}

const loadSettings = () => {
  form.value.enabled = theme.value.glassMode || false
  form.value.opacity = theme.value.glassOpacity ?? 0.85
  // 应用液态玻璃效果类名
  setGlassModeClass(form.value.enabled)
}

const resetToDefaultTheme = () => {
  // 重置主题
  settingsStore.resetTheme()
  // 重新加载设置
  loadSettings()
}

onMounted(() => {
  // 确保在恢复默认配置后正确应用液态玻璃效果
  setGlassModeClass(theme.value.glassMode || false)
  loadSettings()
})
</script>

<style lang="scss" scoped>
.header-effect-container {
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
