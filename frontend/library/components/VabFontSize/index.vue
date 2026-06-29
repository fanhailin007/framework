<template>
  <el-dropdown class="vab-language" popper-class="vab-font-size-popper" @command="handleCommand">
    <span class="font-size-trigger">
      <vab-icon icon="font-size-2" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in fontSizeList" :key="item" :command="item">
          {{ item }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabFontSize',
})

const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const { updateTheme, saveTheme } = settingsStore
const fontSizeList = ref<string[]>(['13px', '13.5px', '14px', '15px', '15.5px', '16px'])

const handleCommand = (fontSize: string) => {
  theme.value.fontSize = fontSize
  updateTheme()
  saveTheme()
}
</script>

<style lang="scss" scoped>
.vab-language {
  .font-size-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
