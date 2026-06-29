<template>
  <div v-if="!['technology', 'gold'].includes(theme.themeName)" class="vab-color-picker">
    <el-color-picker
      v-model="theme.color"
      popper-class="vab-color-picker-popper"
      :predefine="predefineColors"
      style="border-radius: var(--el-border-radius-base)"
      @active-change="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { color as _color } from '/@/config/'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabColorPicker',
})

const predefineColors = ref<any>([_color, '#1e90ff', '#4e6ef2', '#3fb884', '#16baa9', '#009688', '#6954f0', '#f01414'])
const settingsStore = useSettingsStore()
const { updateTheme, saveTheme } = settingsStore
const { theme } = storeToRefs(settingsStore)

const handleChange = (value: any) => {
  theme.value.color = value
  updateTheme()
  saveTheme()
}

onBeforeMount(() => {
  // 还原默认
  $sub('shop-vite-reset-color', (color = _color) => {
    handleChange(color)
  })
})
</script>

<style lang="scss">
.vab-color-picker {
  margin-left: var(--el-margin);
}

.vab-color-picker-popper {
  box-sizing: content-box !important;
  padding: calc(var(--el-padding) / 2);
  border-radius: var(--el-border-radius-base);

  .el-color-dropdown__link-btn {
    display: none;
  }

  .el-color-dropdown__btns {
    margin-top: 0;
  }
}
</style>
