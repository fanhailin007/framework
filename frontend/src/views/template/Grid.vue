<template>
  <div class="grid-container no-background-container">
    <div class="grid-box">
      <el-form :model="queryForm" @submit.prevent>
        <el-form-item label="百分比(10% - 100%)">
          <el-slider v-model="queryForm.count" :max="100" :min="10" style="max-width: 400px" @change="handleChange" />
        </el-form-item>
      </el-form>
      <vab-divider content-position="left" direction="horizontal">auto-fill</vab-divider>
      <div class="vab-grid vab-grid-auto-fill">
        <div v-for="(item, index) in 5" :key="index" class="vab-grid-item"></div>
      </div>
      <vab-divider content-position="left" direction="horizontal">auto-fit</vab-divider>
      <div class="vab-grid vab-grid-auto-fit">
        <div v-for="(item, index) in 3" :key="index" class="vab-grid-item"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'FixedWidth',
})
const settingsStore = useSettingsStore()
const { device } = storeToRefs(settingsStore)

const queryForm = reactive<any>({
  count: 38,
})

const handleChange = (value: any) => {
  const el = ref<HTMLElement | null>(null)
  useCssVar('--el-grid', el).value = `${value}%`
}

onMounted(() => {
  if (device.value == 'mobile') handleChange(100)
  else handleChange(queryForm.count)
})
</script>

<style lang="scss" scoped>
.grid-container {
  .grid-box {
    width: var(--el-grid);
    min-height: var(--el-container-height);
    padding: var(--el-padding);
    margin-bottom: var(--el-margin);
    background-color: var(--el-color-white);
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
  }
}
</style>
